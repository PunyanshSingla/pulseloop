import { Plus, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link, useLocation } from "react-router-dom";

interface TopbarProps {
  userName?: string;
  onMenuClick?: () => void;
}

export function Topbar({ userName, onMenuClick }: TopbarProps) {
  const location = useLocation();
  const firstName = userName?.split(" ")[0] || "there";

  const getTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Overview";
    if (path === "/polls") return "My Polls";
    if (path === "/polls/voted") return "Vote History";
    if (path === "/settings") return "Settings";
    if (path.startsWith("/polls/") && path.endsWith("/edit")) return "Edit Poll";
    if (path === "/polls/create") return "Create Poll";
    return "Overview";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight">{getTitle()}</h1>
          <p className="hidden md:block text-sm text-muted-foreground font-medium">Welcome back, {firstName}. Here's what's moving today.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link 
          to="/polls/create"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 md:px-4 py-2 text-xs md:text-sm font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-95"
        >
          <Plus className="size-4" />
          <span>New poll</span>
        </Link>
      </div>
    </header>
  );
}
