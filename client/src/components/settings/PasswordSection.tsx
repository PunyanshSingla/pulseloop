import { useState } from "react";
import { Lock, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface PasswordSectionProps {
  isSocialLogin: boolean;
}

export function PasswordSection({ isSocialLogin }: PasswordSectionProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
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
  );
}
