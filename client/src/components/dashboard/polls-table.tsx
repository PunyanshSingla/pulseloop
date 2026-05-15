import { BarChart3 } from "lucide-react";
import { usePolls } from "@/hooks/use-polls";
import { Link } from "react-router-dom";
import StatusPill from "./status-pill";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { LoaderContainer } from "@/components/ui/loader";

import type { Poll } from "@/types/polls";

export function PollsTable({ className }: { className?: string }) {
  const { data: pollsResponse, isLoading } = usePolls();
  const polls = pollsResponse?.data?.slice(0, 10) || [];
  const totalCount = pollsResponse?.data?.length || 0;

  return (
    <div className={`rounded-xl border border-border bg-card flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0">
        <div>
          <p className="text-sm font-medium">Recent polls</p>
          <p className="text-xs text-muted-foreground">{polls.length} of {totalCount} polls</p>
        </div>
        <Link to="/polls" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          View all →
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoaderContainer message="Loading polls..." />
        </div>
      ) : polls.length === 0 ? (
        <div className="px-5 py-12 text-center text-muted-foreground flex-1 flex items-center justify-center">
          No polls found.
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10 shadow-[0_1px_0_0_var(--border)]">
              <TableRow>
                <TableHead className="w-[300px]">Poll</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Responses</TableHead>
                <TableHead className="text-right">Completion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {polls.map((p: Poll & { completionRate?: number }) => (
                <TableRow key={p._id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <BarChart3 className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <Link to={`/polls/${p._id}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors truncate block">
                          {p.title}
                        </Link>
                        <p className="text-[10px] font-medium text-muted-foreground truncate uppercase tracking-tight">
                          {p.visibility} • {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusPill status={p.status.charAt(0).toUpperCase() + p.status.slice(1)} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-bold text-sm">
                    {p.responseCount || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${Math.min(p.completionRate || 0, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-foreground">{Math.round(p.completionRate || 0)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
