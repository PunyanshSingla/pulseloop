import { ArrowUpRight, ArrowDownRight, BarChart3, Clock, CheckCircle2, Zap } from "lucide-react";
import { usePolls } from "@/hooks/use-polls";

export function KPIs() {
  const { data: pollsResponse, isLoading } = usePolls();
  const polls = pollsResponse?.data || [];
  
  const totalResponses = polls.reduce((acc: number, p) => acc + (p.responseCount || 0), 0);
  const activePolls = polls.filter((p) => p.status === "active").length;
  const completionRate = polls.length > 0 ? "92.4%" : "0%"; // Mocked for now until we have detailed response data

  const kpis = [
    { label: "Total responses", value: totalResponses.toLocaleString(), change: "+12.4%", up: true, sub: "vs last 30 days", icon: BarChart3 },
    { label: "Active polls", value: activePolls.toString(), change: "+2", up: true, sub: "this week", icon: Zap },
    { label: "Completion rate", value: completionRate, change: "+1.8%", up: true, sub: "avg across polls", icon: CheckCircle2 },
    { label: "Avg. response time", value: "4.2s", change: "-0.4s", up: true, sub: "faster than avg", icon: Clock },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl border border-border bg-card/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => (
        <div
          key={k.label}
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
            <k.icon className="size-3.5 text-muted-foreground/50" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-3xl font-semibold tracking-tight">{k.value}</p>
            <span
              className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium ${
                k.up ? "bg-accent text-accent-foreground" : "bg-destructive/10 text-destructive"
              }`}
            >
              {k.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {k.change}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{k.sub}</p>
          <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ))}
    </div>
  );
}
