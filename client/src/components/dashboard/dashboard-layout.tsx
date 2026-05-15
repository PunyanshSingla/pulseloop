import { authClient } from "@/lib/auth-client";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { Loader2 } from "lucide-react";

export function DashboardLayout() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-bold tracking-tight text-muted-foreground uppercase tracking-widest">Waking up workspace...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <h1 className="text-2xl font-black tracking-tight">Access Denied</h1>
        <p className="max-w-sm text-sm text-muted-foreground font-medium">
          Please sign in to access your workspace dashboard and manage your polls.
        </p>
        <Button onClick={() => navigate("/sign-in")} className="rounded-xl font-bold h-11 px-8">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background relative overflow-hidden selection:bg-primary/10">
      <Sidebar user={session.user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex min-w-0 flex-1 flex-col w-full h-full">
        <Topbar userName={session.user.name} onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 px-4 md:px-6 py-8 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
