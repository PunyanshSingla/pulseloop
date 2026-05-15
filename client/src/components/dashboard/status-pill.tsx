import { Clock, CheckCircle2 } from "lucide-react";

export default function StatusPill({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    Live: { cls: "bg-accent text-accent-foreground", icon: <span className="size-1.5 rounded-full bg-primary" /> },
    Draft: { cls: "bg-muted text-muted-foreground", icon: <Clock className="size-3" /> },
    Closed: { cls: "bg-foreground/5 text-foreground/70", icon: <CheckCircle2 className="size-3" /> },
  };
  const s = map[status] || map.Draft;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.icon}
      {status}
    </span>
  );
}