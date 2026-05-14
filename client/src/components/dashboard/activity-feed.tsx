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
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">Live activity</p>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Realtime
        </span>
      </div>
      <div className="mt-5 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <ul className="space-y-5">
          {events.map((e: any, i: number) => (
            <li key={i} className="flex items-start gap-3.5">
              <div className="mt-0.5 grid size-8 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground shrink-0">
                {e.who.split(" ").map((s: string) => s[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1 text-base">
                <p className="leading-snug">
                  <span className="font-semibold text-foreground">{e.who}</span>{" "}
                  <span className="text-muted-foreground">{e.what}</span>{" "}
                  <span className="font-semibold text-foreground">{e.poll}</span>
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground font-medium">
                {e.when && !isNaN(new Date(e.when).getTime()) 
                  ? formatDistanceToNow(new Date(e.when)) 
                  : "recently"} ago
              </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
