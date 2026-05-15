import React from "react";
import { Clock, Calendar, CheckCircle2 } from "lucide-react";

export type PollStatus = "Running" | "Ended" | "Active" | "Draft" | "Closed";

interface StatusPillProps {
  status: string;
  className?: string;
}

export function StatusPill({ status, className = "" }: StatusPillProps) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    Running: { 
      cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", 
      icon: <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" /> 
    },
    Ended: { 
      cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400", 
      icon: <Calendar className="size-3" /> 
    },
    Active: { 
      cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", 
      icon: <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" /> 
    },
    Draft: { 
      cls: "bg-muted text-muted-foreground", 
      icon: <Clock className="size-3" /> 
    },
    Closed: { 
      cls: "bg-foreground/5 text-foreground/70", 
      icon: <CheckCircle2 className="size-3" /> 
    },
  };

  const s = map[status] || map.Draft;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.cls} ${className}`}>
      {s.icon}
      {status}
    </span>
  );
}
