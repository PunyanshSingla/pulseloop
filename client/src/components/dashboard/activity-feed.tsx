import { useDashboardData } from "@/hooks/use-analytics";
import { formatDistanceToNow } from "date-fns";

export function ActivityFeed() {
  const { data: dashboardDataResponse, isLoading } = useDashboardData();
  const events = dashboardDataResponse?.data?.activity || [];

  if (isLoading) {
    return <div className="h-[300px] animate-pulse rounded-xl border border-border bg-card/50" />;
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 text-center flex flex-col items-center justify-center h-[300px]">
        <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Live activity</p>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Realtime
        </span>
      </div>
      <ul className="mt-4 space-y-4">
        {events.map((e: any, i: number) => (
          <li key={i} className="flex items-start gap-3">
            <div className="mt-0.5 grid size-7 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
              {e.who.split(" ").map((s: string) => s[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1 text-sm">
              <p className="leading-snug">
                <span className="font-medium">{e.who}</span>{" "}
                <span className="text-muted-foreground">{e.what}</span>{" "}
                <span className="font-medium">{e.poll}</span>
              </p>
              <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(e.when))} ago</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
