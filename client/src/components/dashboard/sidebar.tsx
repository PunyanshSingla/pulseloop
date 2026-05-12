import { LayoutGrid, BarChart3, Users, Link2, Settings, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const nav = [
    { icon: LayoutGrid, label: "Overview", active: true },
    { icon: BarChart3, label: "Polls" },
    { icon: Users, label: "Audience" },
    { icon: Link2, label: "Share links" },
    { icon: Settings, label: "Settings" },
  ];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <aside className="hidden w-64 shrink-0 h-screen sticky top-0 flex-col border-r border-border/70 bg-background/50 lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border/70 px-6">
        <Logo className="scale-75 origin-left" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <ul className="space-y-0.5">
          {nav.map((n) => (
            <li key={n.label}>
              <button
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  n.active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <n.icon className="size-4" />
                {n.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-8 rounded-xl border border-border/70 bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4 text-primary" />
            Upgrade to Pro
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Unlimited polls, custom branding, and team seats.
          </p>
          <button className="mt-3 w-full rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-colors hover:opacity-90">
            See plans
          </button>
        </div>
      </nav>

      <div className="border-t border-border/70 p-4 bg-background">
        <div className="flex items-center gap-3">
          {user?.image ? (
            <img src={user.image} alt={user.name} className="size-9 rounded-full object-cover ring-2 ring-primary/20" />
          ) : (
            <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-xs font-semibold text-primary-foreground">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.name || "Anonymous"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email || "No email"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
