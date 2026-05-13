import { ArrowUpRight, ArrowDownRight, BarChart3, Clock, CheckCircle2, Zap } from "lucide-react";
import { useDashboardData } from "@/hooks/use-analytics";

export function KPIs() {
  const { data: dashboardDataResponse, isLoading } = useDashboardData();
  const data = dashboardDataResponse?.data;
  const kpisData = data?.kpis;
  
  const kpis = [
    { 
      label: "Total responses", 
      value: kpisData?.totalResponses?.toLocaleString() || "0", 
      change: kpisData?.totalResponsesGrowth ? `${kpisData.totalResponsesGrowth > 0 ? "+" : ""}${kpisData.totalResponsesGrowth}%` : "0%", 
      up: (kpisData?.totalResponsesGrowth || 0) >= 0, 
      sub: "vs last 30 days", 
      icon: BarChart3 
    },
    { 
      label: "Active polls", 
      value: kpisData?.activePolls?.toString() || "0", 
      change: "0", // Could calculate growth for this too
      up: true, 
      sub: "currently live", 
      icon: Zap 
    },
    { 
      label: "Completion rate", 
      value: kpisData?.completionRate || "N/A", 
      change: "0%", 
      up: true, 
      sub: "avg across polls", 
      icon: CheckCircle2 
    },
    { 
      label: "Avg. response time", 
      value: kpisData?.avgResponseTime || "N/A", 
      change: "0s", 
      up: true, 
      sub: "avg per respondent", 
      icon: Clock 
    },
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
            <p className="text-sm font-semibold text-muted-foreground">{k.label}</p>
            <k.icon className="size-4.5 text-muted-foreground/50" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <p className="text-4xl font-bold tracking-tight">{k.value}</p>
            <span
              className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-sm font-medium ${
                k.up ? "bg-accent text-accent-foreground" : "bg-destructive/10 text-destructive"
              }`}
            >
              {k.up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {k.change}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground/80 font-medium">{k.sub}</p>
          <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ))}
    </div>
  );
}
