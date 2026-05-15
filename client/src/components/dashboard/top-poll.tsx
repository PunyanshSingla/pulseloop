import { TrendingUp, ArrowUpRight, Eye } from "lucide-react";
import { useDashboardData } from "@/hooks/use-analytics";
import { Link } from "react-router-dom";

export function TopPoll() {
  const { data: dashboardDataResponse, isLoading } = useDashboardData();
  const poll = dashboardDataResponse?.data?.topPoll;

  if (isLoading) {
    return <div className="h-[380px] animate-pulse rounded-xl border border-border bg-card/50" />;
  }

  if (!poll) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 text-center flex flex-col items-center justify-center h-[380px]">
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
    <div className="rounded-xl border border-border bg-card p-6 h-[380px] flex flex-col">
      <div className="flex items-start justify-between shrink-0">
        <div>
          <p className="text-base font-bold text-foreground">Top performing poll</p>
          <p className="text-sm text-muted-foreground font-medium">Across the last 30 days</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
          <TrendingUp className="size-3.5" />
          Trending
        </span>
      </div>
      <h3 className="mt-5 text-xl font-extrabold tracking-tight text-foreground shrink-0 line-clamp-2">
        {poll.title}
      </h3>
      <div className="mt-5 space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {options.map((o, i) => (
          <div key={o._id || i}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground/90">{o.text}</span>
              <span className="text-muted-foreground font-bold tabular-nums">
                {Math.round(o.percentage || 0)}% · {o.responseCount || 0}
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className={i === 0 ? "h-full bg-primary" : "h-full bg-foreground/25"}
                style={{ width: `${o.percentage || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground font-semibold">
        <span className="inline-flex items-center gap-1.5">
          <Eye className="size-4" /> {poll.responseCount || 0} responses
        </span>
        <Link to={`/polls/${poll._id}`} className="inline-flex items-center gap-1 font-bold text-foreground hover:underline">
          View report <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
