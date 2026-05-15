import { KPIs } from "@/components/dashboard/kpis";
import { ResponsesChart } from "@/components/dashboard/responses-chart";
import { TopPoll } from "@/components/dashboard/top-poll";
import { PollsTable } from "@/components/dashboard/polls-table";
import { ShareLinkCard } from "@/components/dashboard/share-link-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { UserTypeBreakdown } from "@/components/dashboard/user-type-breakdown";
import { DeviceBreakdown } from "@/components/dashboard/device-breakdown";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">
            Last 30 days Performance
          </p>
          <h2 className="mt-1 text-3xl font-black tracking-tight">Workspace Overview</h2>
        </div>
      </div>

      <KPIs />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ResponsesChart />
        </div>
        <TopPoll />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch min-h-0 lg:min-h-[500px]">
        <div className="lg:col-span-2 flex flex-col min-h-[400px] lg:min-h-0">
          <PollsTable className="flex-1" />
        </div>
        <div className="flex flex-col gap-6 min-h-[400px] lg:min-h-0">
          <ShareLinkCard />
          <ActivityFeed className="flex-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UserTypeBreakdown />
        <DeviceBreakdown />
      </div>
    </div>
  );
}
