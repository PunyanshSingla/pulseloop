import { TrendingUp, ArrowUpRight, Eye } from "lucide-react";
import { useDashboardData } from "@/hooks/use-analytics";
import { Link } from "react-router-dom";

export function TopPoll() {
  const { data: dashboardDataResponse, isLoading } = useDashboardData();
  const poll = dashboardDataResponse?.data?.topPoll;

  if (isLoading) {
    return <div className="h-[300px] animate-pulse rounded-xl border border-border bg-card/50" />;
  }

  if (!poll) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 text-center flex flex-col items-center justify-center h-[300px]">
        <TrendingUp className="size-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium">No trending polls yet</p>
        <p className="text-xs text-muted-foreground">Start by creating your first poll!</p>
      </div>
    );
  }

  // Calculate percentages for the top poll's first question (simple logic for now)
  const firstQuestion = poll.questions?.[0];
  const options = firstQuestion?.options || [];
  
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium">Top performing poll</p>
          <p className="text-xs text-muted-foreground">Across the last 30 days</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-accent px-1.5 py-0.5 text-xs font-medium text-accent-foreground">
          <TrendingUp className="size-3" />
          Trending
        </span>
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight">
        {poll.title}
      </h3>
      <div className="mt-4 space-y-3">
        {options.map((o: any, i: number) => (
          <div key={o._id}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{o.text}</span>
              <span className="text-muted-foreground tabular-nums">
                {Math.round(o.percentage || 0)}% · {o.responseCount || 0}
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={i === 0 ? "h-full bg-primary" : "h-full bg-foreground/25"}
                style={{ width: `${o.percentage || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Eye className="size-3.5" /> {poll.responseCount || 0} responses
        </span>
        <Link to={`/polls/${poll._id}`} className="inline-flex items-center gap-1 font-medium text-foreground hover:underline">
          View report <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
