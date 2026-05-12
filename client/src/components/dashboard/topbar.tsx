import { Search, Bell, Plus } from "lucide-react";

interface TopbarProps {
  userName?: string;
}

export function Topbar({ userName }: TopbarProps) {
  const firstName = userName?.split(" ")[0] || "there";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Overview</h1>
        <p className="text-xs text-muted-foreground">Welcome back, {firstName}. Here's what's moving today.</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search polls, audiences…"
            className="h-9 w-72 rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>
        <button className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="size-4" />
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-sm ring-1 ring-primary/30 transition-all hover:brightness-110">
          <Plus className="size-4" />
          New poll
        </button>
      </div>
    </header>
  );
}
