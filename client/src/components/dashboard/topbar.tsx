import { Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "react-router-dom";

interface TopbarProps {
  userName?: string;
}

export function Topbar({ userName }: TopbarProps) {
  const firstName = userName?.split(" ")[0] || "there";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground font-medium">Welcome back, {firstName}. Here's what's moving today.</p>
      </div>
      <div className="flex items-center gap-2.5">
        <ThemeToggle />
        <Link 
          to="/polls/create"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-95"
        >
          <Plus className="size-5" />
          New poll
        </Link>
      </div>
    </header>
  );
}
