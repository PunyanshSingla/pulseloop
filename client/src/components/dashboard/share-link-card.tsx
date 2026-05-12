import { Globe, Copy } from "lucide-react";

export function ShareLinkCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Quick share</p>
        <Globe className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Send your latest poll anywhere.</p>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 font-mono text-xs">
        <span className="truncate">pulseloop.io/p/q3-roadmap</span>
        <button className="ml-auto inline-flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background hover:opacity-90">
          <Copy className="size-3" /> Copy
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        {["Slack", "Email", "X / Twitter"].map((c) => (
          <button
            key={c}
            className="rounded-lg border border-border bg-background py-2 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
