import { BarChart3, MoreHorizontal, CheckCircle2, Clock } from "lucide-react";

const polls = [
  { name: "Q3 product roadmap priorities", status: "Live", votes: 2410, rate: 92, updated: "2m ago" },
  { name: "Pricing tier preference", status: "Live", votes: 1890, rate: 88, updated: "14m ago" },
  { name: "Onboarding flow A/B", status: "Live", votes: 1562, rate: 81, updated: "1h ago" },
  { name: "New logo direction", status: "Draft", votes: 0, rate: 0, updated: "Yesterday" },
  { name: "Conference talk topics", status: "Closed", votes: 4012, rate: 95, updated: "3d ago" },
];

export function PollsTable() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <p className="text-sm font-medium">Recent polls</p>
          <p className="text-xs text-muted-foreground">5 of 18 polls</p>
        </div>
        <button className="text-xs font-medium text-muted-foreground hover:text-foreground">
          View all →
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-5 py-2.5 font-medium">Poll</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 text-right font-medium">Responses</th>
              <th className="px-5 py-2.5 font-medium">Completion</th>
              <th className="px-5 py-2.5 font-medium">Updated</th>
              <th className="px-5 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {polls.map((p) => (
              <tr key={p.name} className="border-b border-border/70 last:border-0 transition-colors hover:bg-muted/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-md bg-muted text-muted-foreground">
                      <BarChart3 className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">pulseloop.io/{p.name.toLowerCase().replace(/\s+/g, "-").slice(0, 18)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <StatusPill status={p.status} />
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums">{p.votes.toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${p.rate}%` }} />
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground">{p.rate}%</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.updated}</td>
                <td className="px-5 py-3.5 text-right">
                  <button className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <MoreHorizontal className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
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
