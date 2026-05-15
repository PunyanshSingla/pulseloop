import { Link } from "react-router-dom";
import { BarChart3, Edit, Lock, Unlock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import type { Poll } from "@/types/polls";

interface PollTableProps {
  polls: Poll[];
  onEdit: (poll: Poll) => void;
  onToggleStatus: (poll: Poll) => void;
  onDelete: (id: string) => void;
  canEdit: (poll: Poll) => boolean;
  searchQuery: string;
}

export function PollTable({ polls, onEdit, onToggleStatus, onDelete, canEdit, searchQuery }: PollTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Poll</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="text-right">Responses</TableHead>
            <TableHead className="hidden lg:table-cell text-right">Completion</TableHead>
            <TableHead className="hidden xl:table-cell">Updated</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {polls.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                {searchQuery ? "No polls match your search." : "No polls found."}
              </TableCell>
            </TableRow>
          ) : (
            polls.map((p) => (
              <TableRow key={p._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-md bg-muted text-muted-foreground">
                      <BarChart3 className="size-4" />
                    </div>
                    <Link to={`/polls/${p._id}`} className="font-medium hover:text-primary transition-colors">
                      {p.title}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <StatusPill status={p.status.charAt(0).toUpperCase() + p.status.slice(1)} />
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{p.visibility.charAt(0).toUpperCase() + p.visibility.slice(1)}</TableCell>
                <TableCell className="text-right tabular-nums font-semibold">{p.responseCount || 0}</TableCell>
                <TableCell className="hidden lg:table-cell text-right tabular-nums">
                  {p.viewCount > 0 
                    ? `${Math.min(100, Math.round((p.responseCount / p.viewCount) * 100))}%` 
                    : "0%"}
                </TableCell>
                <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                  {p.updatedAt ? formatDistanceToNow(new Date(p.updatedAt)) : "N/A"} ago
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(p)}
                      className={`h-7 w-7 p-0 ${!canEdit(p) ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={canEdit(p) ? "Edit Poll" : "Edit Restricted"}
                    >
                      <Edit className="size-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onToggleStatus(p)}
                      className={`h-7 w-7 p-0 ${p.status === "active" ? "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10" : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"}`}
                      title={p.status === "active" ? "Close Poll" : "Re-open Poll"}
                    >
                      {p.status === "active" ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(p._id)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete Poll"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
