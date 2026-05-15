import { useRef, useState } from "react";
import { User, Camera, Upload, Loader2, Mail, ShieldCheck, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mediaApi } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface ProfileSectionProps {
  session: any;
  initialName: string;
  initialImage: string;
}

export function ProfileSection({ session, initialName, initialImage }: ProfileSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

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
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
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
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
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
                <label className="text-sm font-bold flex items-center gap-2">Full Name</label>
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
  );
}
