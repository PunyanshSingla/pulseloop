import { useDashboardData } from "@/hooks/use-analytics";
import { useState } from "react";
import { Users, UserX, UserCheck } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function UserTypeBreakdown() {
  const { data: dashboardDataResponse, isLoading } = useDashboardData();
  const kpis = dashboardDataResponse?.data?.kpis;

  const data = [
    { name: "Logged-in", value: kpis?.loggedInResponses || 0, color: "var(--primary)" },
    { name: "Anonymous", value: kpis?.anonymousResponses || 0, color: "oklch(0.85 0.05 190)" },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const total = (kpis?.loggedInResponses || 0) + (kpis?.anonymousResponses || 0);
  const loggedInPercentage = total > 0 ? Math.round((kpis?.loggedInResponses || 0) / total * 100) : 0;
  const anonymousPercentage = total > 0 ? 100 - loggedInPercentage : 0;

  if (isLoading) {
    return <div className="h-[320px] animate-pulse rounded-xl border border-border bg-card/50" />;
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-base font-bold text-foreground">User Breakdown</p>
          <p className="text-xs text-muted-foreground font-medium">Total Audience Type</p>
        </div>
        <Users className="size-4 text-muted-foreground/50" />
      </div>

      <div className="flex-1 min-h-[180px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                  style={{ outline: "none" }}
                />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-border bg-card p-3 shadow-2xl">
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="size-2 rounded-full" 
                          style={{ backgroundColor: payload[0].payload.color }} 
                        />
                        <p className="text-xs font-bold text-foreground">
                          {payload[0].name}
                        </p>
                      </div>
                      <p className="text-sm font-black text-foreground pl-4">
                        {payload[0].value} <span className="text-[10px] text-muted-foreground uppercase tracking-widest ml-1">Votes</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-200 ${activeIndex !== null ? "opacity-0" : "opacity-100"}`}>
          <p className="text-2xl font-bold text-foreground">{total}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Votes</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <UserCheck className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Logged-in</p>
              <p className="text-[10px] text-muted-foreground font-medium">{loggedInPercentage}% of audience</p>
            </div>
          </div>
          <p className="text-sm font-bold text-foreground">{kpis?.loggedInResponses || 0}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground">
              <UserX className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Anonymous</p>
              <p className="text-[10px] text-muted-foreground font-medium">{anonymousPercentage}% of audience</p>
            </div>
          </div>
          <p className="text-sm font-bold text-foreground">{kpis?.anonymousResponses || 0}</p>
        </div>
      </div>
    </div>
  );
}
