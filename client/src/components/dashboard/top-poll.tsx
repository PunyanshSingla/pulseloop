import { TrendingUp, ArrowUpRight, Eye } from "lucide-react";

export function TopPoll() {
  const options = [
    { label: "Dark mode by default", pct: 62, votes: 1840 },
    { label: "System preference", pct: 28, votes: 832 },
    { label: "Light mode by default", pct: 10, votes: 297 },
  ];
  return (
    <div className="rounded-xl border border-border/70 bg-card p-5">
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
        Should our app default to dark mode?
      </h3>
      <div className="mt-4 space-y-3">
        {options.map((o, i) => (
          <div key={o.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{o.label}</span>
              <span className="text-muted-foreground tabular-nums">
                {o.pct}% · {o.votes.toLocaleString()}
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={i === 0 ? "h-full bg-primary" : "h-full bg-foreground/25"}
                style={{ width: `${o.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Eye className="size-3.5" /> 4,210 views
        </span>
        <button className="inline-flex items-center gap-1 font-medium text-foreground hover:underline">
          View report <ArrowUpRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
