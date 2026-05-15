import { useDashboardData } from "@/hooks/use-analytics";
import { Monitor, Smartphone, Tablet, Globe } from "lucide-react";

export function DeviceBreakdown() {
  const { data: dashboardDataResponse, isLoading } = useDashboardData();
  const devices = dashboardDataResponse?.data?.demographics?.devices || [];
  
  const total = devices.reduce((acc: number, curr: any) => acc + curr.value, 0);

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "desktop": return Monitor;
      case "mobile": return Smartphone;
      case "tablet": return Tablet;
      default: return Globe;
    }
  };

  if (isLoading) {
    return <div className="h-[320px] animate-pulse rounded-xl border border-border bg-card/50" />;
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-base font-bold text-foreground">Device Distribution</p>
          <p className="text-xs text-muted-foreground font-medium">Participation by Platform</p>
        </div>
        <Monitor className="size-4 text-muted-foreground/50" />
      </div>

      <div className="space-y-5 flex-1 justify-center flex flex-col">
        {devices.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-12">No device data available</p>
        ) : devices.map((d: any) => {
          const Icon = getIcon(d.name);
          const percentage = total > 0 ? Math.round((d.value / total) * 100) : 0;
          
          return (
            <div key={d.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-3.5" />
                  </div>
                  <span className="text-sm font-bold text-foreground">{d.name}</span>
                </div>
                <span className="text-sm font-black text-foreground">{percentage}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {total > 0 && (
        <div className="mt-6 pt-6 border-t border-border/50">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            Total tracked devices: <span className="text-foreground">{total}</span>
          </p>
        </div>
      )}
    </div>
  );
}
