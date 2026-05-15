import { Shield, Fingerprint, Activity, Server } from "lucide-react";

export function SecuritySection() {
  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 px-6 py-24 border-y border-border">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Safe and Reliable Polling</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We keep your data safe and ensure that every vote is real. PulseLoop is built for speed and security.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
            <Shield className="size-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Duplicate Protection</h3>
            <p className="text-sm text-muted-foreground">Identify unique voters to prevent multiple submissions and maintain data integrity.</p>
          </div>
          <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
            <Fingerprint className="size-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Unique Identity</h3>
            <p className="text-sm text-muted-foreground">Ensuring vote integrity while respecting voter anonymity and privacy.</p>
          </div>
          <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
            <Activity className="size-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Real-time Validation</h3>
            <p className="text-sm text-muted-foreground">Instant validation of every response against your poll's specific rules.</p>
          </div>
          <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
            <Server className="size-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Modern Architecture</h3>
            <p className="text-sm text-muted-foreground">Built with cutting-edge technologies to ensure stability and rapid response times.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
