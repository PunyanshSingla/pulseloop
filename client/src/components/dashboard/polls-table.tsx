import { BarChart3, MoreHorizontal, CheckCircle2, Clock } from "lucide-react";
import { usePolls } from "@/hooks/use-polls";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

export function PollsTable() {
  const { data: pollsResponse, isLoading } = usePolls();
  const polls = pollsResponse?.data?.slice(0, 5) || [];
  const totalCount = pollsResponse?.data?.length || 0;
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <p className="text-sm font-medium">Recent polls</p>
          <p className="text-xs text-muted-foreground">{polls.length} of {totalCount} polls</p>
        </div>
        <Link to="/polls" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          View all →
        </Link>
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
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p>Loading polls...</p>
                  </div>
                </td>
              </tr>
            ) : polls.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                  No polls found.
                </td>
              </tr>
            ) : polls.map((p: any) => (
              <tr key={p._id} className="border-b border-border/70 last:border-0 transition-colors hover:bg-muted/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-md bg-muted text-muted-foreground">
                      <BarChart3 className="size-4" />
                    </div>
                    <div>
                      <Link to={`/polls/${p._id}`} className="text-base font-semibold hover:text-primary transition-colors">{p.title}</Link>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {import.meta.env.VITE_APP_ORIGIN.replace(/^https?:\/\//, "")}/p/{p._id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <StatusPill status={p.status.charAt(0).toUpperCase() + p.status.slice(1)} />
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums font-medium">{p.responseCount || 0}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Responses collected</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground">{formatDistanceToNow(new Date(p.createdAt))} ago</td>
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
