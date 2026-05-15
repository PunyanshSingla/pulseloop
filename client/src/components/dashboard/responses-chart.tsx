import { useDashboardData } from "@/hooks/use-analytics";
import { useState, useMemo } from "react";
import { format, subDays, eachDayOfInterval } from "date-fns";

export function ResponsesChart() {
  const [range, setRange] = useState(30);
  const { data: dashboardDataResponse, isLoading } = useDashboardData(range);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Fill in missing dates with zero counts
  const chartData = useMemo(() => {
    const rawData = dashboardDataResponse?.data?.chartData || [];
    const end = new Date();
    const start = subDays(end, range - 1);
    const interval = eachDayOfInterval({ start, end });
    
    return interval.map(date => {
      const dateStr = format(date, "yyyy-MM-dd");
      const found = (rawData as { date: string, total: number, anonymous?: number, loggedIn?: number }[]).find((d) => d.date === dateStr);
      return {
        date: dateStr,
        label: format(date, "MMM dd"),
        count: found ? found.total : 0,
        anonymous: found ? (found.anonymous || 0) : 0,
        loggedIn: found ? (found.loggedIn || 0) : 0,
      };
    });
  }, [dashboardDataResponse, range]);

  const data = chartData.map(d => d.count);
  const max = Math.max(...data, 5); // Minimum scale
  const w = 600;
  const h = 200;
  const step = w / (data.length - 1 || 1);
  
  const points = data
    .map((v: number, i: number) => {
      const x = i * step;
      const y = h - (v / max) * (h - 40) - 20;
      return `${x},${y}`;
    })
    .join(" ");
  
  const area = `0,${h} ${points} ${w},${h}`;

  if (isLoading) {
    return <div className="h-[380px] animate-pulse rounded-xl border border-border bg-card/50" />;
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 h-[380px] flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-bold text-foreground">Responses over time</p>
          <p className="text-sm text-muted-foreground font-medium">Last {range} days</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1 text-sm">
          {[
            { label: "7d", value: 7 },
            { label: "30d", value: 30 },
            { label: "90d", value: 90 },
          ].map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.value)}
              className={`rounded-md px-3 py-1.5 font-bold transition-all ${
                range === r.value 
                  ? "bg-foreground text-background shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-8 group/chart">
        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div 
            className="absolute z-10 pointer-events-none rounded-xl bg-foreground p-3 text-xs font-bold text-background shadow-2xl -translate-x-1/2 -translate-y-full transition-all duration-200 border border-white/10"
            style={{ 
              left: `${(hoveredIndex * step) / w * 100}%`,
              top: `${h - (data[hoveredIndex] / max) * (h - 40) - 35}px`
            }}
          >
            <div className="text-[10px] uppercase tracking-widest opacity-50 mb-2 border-b border-white/10 pb-1">
              {chartData[hoveredIndex].label}
            </div>
            <div className="space-y-1.5 min-w-[120px]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-background/80">
                  <div className="size-1.5 rounded-full bg-primary" />
                  <span>Total</span>
                </div>
                <span>{chartData[hoveredIndex].count}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-background/60">
                  <div className="size-1.5 rounded-full bg-primary/40" />
                  <span>Anonymous</span>
                </div>
                <span>{chartData[hoveredIndex].anonymous}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-background/60">
                  <div className="size-1.5 rounded-full bg-white/40" />
                  <span>Logged-in</span>
                </div>
                <span>{chartData[hoveredIndex].loggedIn}</span>
              </div>
            </div>
            <div className="absolute left-1/2 bottom-0 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 bg-foreground" />
          </div>
        )}

        <svg 
          viewBox={`0 0 ${w} ${h}`} 
          className="h-52 w-full overflow-visible"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 1, 2].map((i) => (
            <line
              key={i}
              x1="0"
              x2={w}
              y1={(h / 2) * i}
              y2={(h / 2) * i}
              stroke="var(--border)"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          ))}

          <polygon points={area} fill="url(#chartFill)" className="transition-all duration-500" />
          
          <polyline
            points={points}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500"
          />

          {data.map((v, i) => {
            const x = i * step;
            const y = h - (v / max) * (h - 40) - 20;
            const isHovered = hoveredIndex === i;
            
            return (
              <g key={i} onMouseEnter={() => setHoveredIndex(i)}>
                {/* Invisible larger hit area for hover */}
                <rect
                  x={x - step / 2}
                  y={0}
                  width={step}
                  height={h}
                  fill="transparent"
                  className="cursor-pointer"
                />
                
                {/* Vertical hover line */}
                {isHovered && (
                  <line
                    x1={x}
                    x2={x}
                    y1={0}
                    y2={h}
                    stroke="var(--primary)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="pointer-events-none"
                  />
                )}

                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? "5" : "3"}
                  fill="var(--background)"
                  stroke="var(--primary)"
                  strokeWidth={isHovered ? "3" : "2"}
                  className="transition-all duration-200 pointer-events-none"
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-6 flex justify-between px-1 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
        <span>{chartData[0].label}</span>
        <span>{chartData[Math.floor(chartData.length / 2)].label}</span>
        <span>{chartData[chartData.length - 1].label}</span>
      </div>
    </div>
  );
}

