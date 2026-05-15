import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Lock, Camera, Save, Loader2, Mail, ShieldCheck, Upload, AlertCircle } from "lucide-react";
import { mediaApi, usersApi } from "@/lib/api";

export default function SettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [userData, setUserData] = useState<{ hasPassword?: boolean } | null>(null);
  const [isUserPending, setIsUserPending] = useState(true);
  const [isProfileInitialized, setIsProfileInitialized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await usersApi.getMe();
        setUserData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsUserPending(false);
      }
    };
    fetchUser();
  }, []);

  const isSocialLogin = !isUserPending && userData && !userData.hasPassword;
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (session?.user && !isProfileInitialized) {
      queueMicrotask(() => {
        setName(session.user.name || "");
        setImage(session.user.image || "");
        setIsProfileInitialized(true);
      });
    }
  }, [session, isProfileInitialized]);

  if (isPending || isUserPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image size must be less than 2MB");
    }

    const formData = new FormData();
    formData.append("file", file);
    
    setIsUploading(true);
    try {
      const response = await mediaApi.upload(formData);
      
      if (response.success && response.data.secure_url) {
        setImage(response.data.secure_url);
        toast.success("Image uploaded successfully! Click 'Update Profile' to save.");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");
    
    setIsUpdatingProfile(true);
    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });
      
      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSocialLogin) return;
    if (!currentPassword) return toast.error("Current password is required");
    if (newPassword.length < 8) return toast.error("New password must be at least 8 characters");
    if (newPassword !== confirmPassword) return toast.error("New passwords do not match");
    
    setIsUpdatingPassword(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      <Sidebar user={session?.user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-1 flex-col w-full h-full">
        <Topbar userName={session?.user?.name} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 px-4 md:px-6 py-6 md:py-10 overflow-y-auto">
          <div className="mx-auto max-w-4xl space-y-8 md:space-y-12">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Settings</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-2">Manage your account details and security preferences.</p>
            </div>

            <div className="grid gap-12 lg:grid-cols-1">
              {/* Profile Information Section */}
              <section className="rounded-2xl border border-border bg-card p-4 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 md:mb-8 border-b border-border pb-6">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <User className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold">Profile Information</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Update your public identity on PulseLoop.</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="flex flex-col gap-8 md:flex-row md:items-start">
                    <div className="flex flex-col items-center gap-4">
                      <div 
                        className="relative group size-32 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {image ? (
                          <img 
                            src={image} 
                            alt="Avatar" 
                            className="size-full rounded-full object-cover ring-4 ring-primary/10 transition-all group-hover:ring-primary/20" 
                          />
                        ) : (
                          <div className="size-full rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl font-bold text-primary">
                            {name?.[0] || session?.user?.name?.[0] || "?"}
                          </div>
                        )}
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                          {isUploading ? (
                            <Loader2 className="text-white size-6 animate-spin" />
                          ) : (
                            <>
                              <Upload className="text-white size-6 mb-1" />
                              <span className="text-[8px] text-white font-bold uppercase tracking-widest">Upload</span>
                            </>
                          )}
                        </div>
                      </div>
                      <input 
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Profile Picture</p>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-bold flex items-center gap-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none ring-primary/10 transition-all focus:border-primary/50 focus:ring-4"
                              placeholder="Enter your name"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
                            Email Address <ShieldCheck className="size-3 text-emerald-500" />
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
                            <input 
                              value={session?.user?.email}
                              disabled
                              className="h-11 w-full rounded-xl border border-border bg-muted/30 pl-10 pr-4 text-sm text-muted-foreground cursor-not-allowed outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold">Avatar URL</label>
                        <div className="relative">
                          <Camera className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <input 
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://example.com/avatar.png"
                            className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none ring-primary/10 transition-all focus:border-primary/50 focus:ring-4"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium">Or paste a direct link to an image file.</p>
                      </div>

                      <div className="flex justify-end pt-4 md:pt-2">
                        <Button disabled={isUpdatingProfile || isUploading} className="h-11 w-full md:w-auto gap-2 rounded-xl px-8 font-bold">
                          {isUpdatingProfile ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                          Update Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </section>

              {/* Security Section */}
              <section className="rounded-2xl border border-border bg-card p-4 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 md:mb-8 border-b border-border pb-6">
                  <div className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
                    <Lock className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold">Security & Password</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Manage your account security and password.</p>
                  </div>
                </div>

                {isSocialLogin ? (
                  <div className="flex flex-col items-center justify-center py-8 px-6 bg-muted/30 rounded-2xl border border-dashed border-border text-center">
                    <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                      <AlertCircle className="size-6 text-blue-500" />
                    </div>
                    <h3 className="font-bold text-lg">Social Account Connected</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm leading-relaxed">
                      You are logged in using a social provider (Google). Password management is handled securely through your social account settings.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword} className="max-w-2xl space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Current Password</label>
                      <input 
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none ring-primary/10 transition-all focus:border-primary/50 focus:ring-4"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">New Password</label>
                        <input 
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none ring-primary/10 transition-all focus:border-primary/50 focus:ring-4"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Confirm New Password</label>
                        <input 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none ring-primary/10 transition-all focus:border-primary/50 focus:ring-4"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Changing your password will sign you out of all other active sessions for security.
                      </p>
                      <Button 
                        type="submit"
                        disabled={isUpdatingPassword} 
                        variant="outline" 
                        className="h-11 w-full md:w-auto gap-2 rounded-xl border-primary px-8 font-bold text-primary hover:bg-primary/5"
                      >
                        {isUpdatingPassword ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                        Change Password
                      </Button>
                    </div>
                  </form>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
