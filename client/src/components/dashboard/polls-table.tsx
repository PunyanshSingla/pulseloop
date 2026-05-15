import { BarChart3, ExternalLink } from "lucide-react";
import { usePolls } from "@/hooks/use-polls";
import { formatDistanceToNow } from "date-fns";
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
    <div className={`rounded-xl border border-border bg-card ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <p className="text-sm font-medium">Recent polls</p>
          <p className="text-xs text-muted-foreground">{polls.length} of {totalCount} polls</p>
        </div>
        <Link to="/polls" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          View all →
        </Link>
      </div>
      
      {isLoading ? (
        <LoaderContainer message="Loading polls..." />
      ) : polls.length === 0 ? (
        <div className="px-5 py-12 text-center text-muted-foreground">
          No polls found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Poll</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Responses</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {polls.map((p: Poll & { completionRate?: number }) => (
              <TableRow key={p._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-md bg-muted text-muted-foreground">
                      <BarChart3 className="size-4" />
                    </div>
                    <div>
                      <Link to={`/polls/${p._id}`} className="text-base font-semibold hover:text-primary transition-colors">{p.title}</Link>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {import.meta.env.VITE_APP_ORIGIN.replace(/^https?:\/\//, "")}/vote/{p._id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusPill status={p.status.charAt(0).toUpperCase() + p.status.slice(1)} />
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">{p.responseCount || 0}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${Math.min(p.completionRate || 0, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground/80">{Math.round(p.completionRate || 0)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {p.createdAt && !isNaN(new Date(p.createdAt).getTime())
                    ? formatDistanceToNow(new Date(p.createdAt))
                    : "N/A"} ago
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    to={`/polls/${p._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    View <ExternalLink className="size-3" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
