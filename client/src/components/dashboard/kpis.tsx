import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const kpis = [
  { label: "Total responses", value: "24,891", change: "+12.4%", up: true, sub: "vs last 30 days" },
  { label: "Active polls", value: "18", change: "+3", up: true, sub: "this week" },
  { label: "Completion rate", value: "87.2%", change: "+1.8%", up: true, sub: "avg across polls" },
  { label: "Avg. time to vote", value: "4.6s", change: "-0.3s", up: true, sub: "faster than last week" },
];

export function KPIs() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => (
        <div
          key={k.label}
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
        >
          <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
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
