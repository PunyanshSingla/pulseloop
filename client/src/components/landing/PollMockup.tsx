import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function PollMockup() {
  const options = [
    { label: "AI-Powered Poll Generation", pct: 42, active: true },
    { label: "Real-time Analytics", pct: 28, active: false },
    { label: "Flexible Access Controls", pct: 30, active: false },
  ];
  return (
    <motion.div 
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-card p-8 shadow-2xl ring-1 ring-black/5 md:p-12 transition-shadow hover:shadow-primary/10"
    >
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
            Live Poll
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {typeof window !== 'undefined' ? window.location.host : 'pulseloop.io'}/p/q3-roadmap
          </span>
        </div>
        <h2 className="mb-6 max-w-[40ch] text-balance text-xl font-medium">
          Which feature should we prioritize for the Q3 roadmap?
        </h2>
        <div className="space-y-4">
          {options.map((o, i) => (
            <div key={o.label}>
              <div className="mb-2 flex items-center justify-between">
                <span className={`text-sm font-medium ${o.active ? "" : "text-muted-foreground"}`}>
                  {o.label}
                </span>
                <span className={`text-sm ${o.active ? "text-foreground" : "text-muted-foreground"}`}>
                  {o.pct}%
                </span>
              </div>
              <div className={`relative h-10 w-full overflow-hidden rounded-lg border ${o.active ? "border-border bg-muted" : "border-border/60 bg-muted/60"}`}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${o.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                  className={`h-full transition-all ${o.active ? "border-r border-primary bg-primary/20" : "bg-muted-foreground/15"}`}
                />
                {o.active && (
                  <div className="absolute inset-0 flex items-center px-4">
                    <div className="mr-3 grid size-4 place-items-center rounded-full border-2 border-primary bg-card">
                      <Check className="size-2 text-primary" strokeWidth={4} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-6">
        <div className="flex -space-x-2">
          <div className="size-6 rounded-full border-2 border-card bg-zinc-200" />
          <div className="size-6 rounded-full border-2 border-card bg-zinc-300" />
          <div className="size-6 rounded-full border-2 border-card bg-zinc-400" />
        </div>
        <span className="text-xs text-muted-foreground">842 responses collected</span>
      </div>
    </motion.div>
  );
}
