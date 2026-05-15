import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { usersApi } from "@/lib/api";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { PasswordSection } from "@/components/settings/PasswordSection";

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const [userData, setUserData] = useState<{ hasPassword?: boolean } | null>(null);
  const [isUserPending, setIsUserPending] = useState(true);

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

  if (isUserPending) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 md:space-y-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">Manage your account details and security preferences.</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-1">
        <ProfileSection 
          session={session} 
          initialName={session?.user?.name || ""} 
          initialImage={session?.user?.image || ""} 
        />
        
        <PasswordSection isSocialLogin={!!isSocialLogin} />
      </div>
    </div>
  );
}
