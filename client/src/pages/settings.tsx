import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { Loader2 } from "lucide-react";
import { usersApi } from "@/lib/api";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { PasswordSection } from "@/components/settings/PasswordSection";

export default function SettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [userData, setUserData] = useState<{ hasPassword?: boolean } | null>(null);
  const [isUserPending, setIsUserPending] = useState(true);
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

  if (isPending || isUserPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

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
              <ProfileSection 
                session={session} 
                initialName={session?.user?.name || ""} 
                initialImage={session?.user?.image || ""} 
              />
              
              <PasswordSection isSocialLogin={!!isSocialLogin} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
