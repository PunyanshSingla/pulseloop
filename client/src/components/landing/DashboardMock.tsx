import { BarChart3, TrendingUp, Clock, Users } from "lucide-react";

export function DashboardMock() {
  const stats = [
    { label: "Total responses", value: "12,438", change: "+18.2%", icon: Users },
    { label: "Completion", value: "94%", change: "+2.4%", icon: TrendingUp },
    { label: "Avg. time", value: "38s", change: "stable", icon: Clock },
  ];

  // SVG Line path for the mockup
  const points = "0,80 50,60 100,70 150,30 200,50 250,10 300,40 350,20 400,30 450,15 500,25";

  return (
    <div className="w-full overflow-hidden rounded-sm bg-card border border-border shadow-sm ring-1 ring-black/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-emerald-500" />
          <span className="text-sm font-bold tracking-tight">Response Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-background p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
              <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <s.icon className="size-3.5 text-muted-foreground/50" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black tracking-tight">{s.value}</h4>
                <p className={`text-[10px] font-bold ${s.change.startsWith('+') ? "text-emerald-500" : "text-muted-foreground"}`}>
                  {s.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mini Chart - Line style to match real app */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Responses over time</span>
            <span className="text-[10px] font-medium text-muted-foreground">Last 30 days</span>
          </div>
          <div className="relative h-32 w-full px-1 pt-4">
            <svg viewBox="0 0 500 100" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="mockGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M ${points} L 500,100 L 0,100 Z`}
                fill="url(#mockGradient)"
              />
              <path
                d={`M ${points}`}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Data points */}
              {points.split(' ').map((p, i) => {
                const [x, y] = p.split(',');
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="var(--card)"
                    stroke="var(--primary)"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-1 w-4 rounded-full bg-muted/50" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
