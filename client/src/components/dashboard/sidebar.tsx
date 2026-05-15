import { LayoutGrid, BarChart3, Settings, LogOut, History } from "lucide-react";
import { Logo } from "@/components/logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const nav = [
    { icon: LayoutGrid, label: "Overview", href: "/dashboard" },
    { icon: BarChart3, label: "Polls", href: "/polls" },
    { icon: History, label: "History", href: "/polls/voted" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <aside className="hidden w-64 shrink-0 h-screen sticky top-0 flex-col border-r border-border bg-background/50 lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Logo className="scale-75 origin-left" noLink />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <p className="px-3 pb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
          Workspace
        </p>
        <ul className="space-y-1">
          {nav.map((n) => {
            const isActive = location.pathname === n.href;
            return (
              <li key={n.label}>
                <Link
                  to={n.href}
                  className={`flex w-full items-center gap-3.5 rounded-lg px-3.5 py-2.5 text-base font-semibold transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <n.icon className="size-5" />
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-5 bg-background space-y-4">
        <div className="flex items-center gap-3.5">
          {user?.image ? (
            <img src={user.image} alt={user.name} className="size-10 rounded-full object-cover ring-2 ring-primary/20" />
          ) : (
            <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-sm font-bold text-primary-foreground">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-base font-bold">{user?.name || "Anonymous"}</p>
            <p className="truncate text-sm text-muted-foreground font-medium">{user?.email || "No email"}</p>
          </div>
        </div>
        <button 
          onClick={async () => {
            await authClient.signOut();
            navigate("/sign-in");
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
