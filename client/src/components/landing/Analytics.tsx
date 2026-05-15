import { BarChart3, Users, Globe, Smartphone } from "lucide-react";
import { DashboardMock } from "./DashboardMock";

export function Analytics() {
  return (
    <section id="analytics" className="bg-card px-6 py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row">
        <div className="flex-1">
          <h2 className="mb-6 max-w-[20ch] text-balance text-3xl font-semibold tracking-tight">
            Clear Results for Everyone
          </h2>
          <p className="mb-8 max-w-[48ch] text-base text-muted-foreground">
            Understand your data without being an expert. We show you simple charts, 
            voter locations, and device types so you can make better decisions.
          </p>
          <div className="grid grid-cols-2 gap-8 border-t border-border pt-8">
            <div>
              <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
                <Users className="size-4 text-primary" />
                Audience Identity
              </p>
              <p className="text-xs text-muted-foreground">Know who's voting - guests vs users.</p>
            </div>
            <div>
              <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
                <Globe className="size-4 text-primary" />
                Geo-Location
              </p>
              <p className="text-xs text-muted-foreground">See exactly where your responses are from.</p>
            </div>
            <div>
              <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
                <Smartphone className="size-4 text-primary" />
                Device Types
              </p>
              <p className="text-xs text-muted-foreground">Mobile vs Desktop breakdown.</p>
            </div>
            <div>
              <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="size-4 text-primary" />
                Live Timeline
              </p>
              <p className="text-xs text-muted-foreground">Track participation over time.</p>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full max-w-2xl">
          <DashboardMock />
        </div>
      </div>
    </section>
  );
}
