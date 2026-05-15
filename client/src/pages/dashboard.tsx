import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { KPIs } from "@/components/dashboard/kpis";
import { ResponsesChart } from "@/components/dashboard/responses-chart";
import { TopPoll } from "@/components/dashboard/top-poll";
import { PollsTable } from "@/components/dashboard/polls-table";
import { ShareLinkCard } from "@/components/dashboard/share-link-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Access Denied</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Please sign in to access your workspace dashboard and manage your polls.
        </p>
        <Button onClick={() => navigate("/sign-in")} className="rounded-lg">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background relative overflow-x-hidden">
      <Sidebar user={session.user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex min-w-0 flex-1 flex-col w-full">
        <Topbar userName={session.user.name} onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">
                  Last 30 days
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Performance at a glance</h2>
              </div>
            </div>

            <KPIs />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ResponsesChart />
              </div>
              <TopPoll />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
              <div className="lg:col-span-2 flex flex-col">
                <PollsTable className="flex-1" />
              </div>
              <div className="flex flex-col gap-6">
                <ShareLinkCard />
                <ActivityFeed className="flex-1" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
