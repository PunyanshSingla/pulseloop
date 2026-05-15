import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Edit, Lock, Unlock, Trash2, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { formatDistanceToNow } from "date-fns";
import type { Poll } from "@/types/polls";

interface PollCardProps {
  poll: Poll;
  onEdit: (poll: Poll) => void;
  onToggleStatus: (poll: Poll) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
}

export function PollCard({ poll, onEdit, onToggleStatus, onDelete, canEdit }: PollCardProps) {
  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date();
  const isRunning = poll.status === "active" && !isExpired;
  const displayStatus = isRunning ? "Running" : isExpired ? "Ended" : poll.status.charAt(0).toUpperCase() + poll.status.slice(1);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-muted text-muted-foreground">
            <BarChart3 className="size-5" />
          </div>
          <div>
            <Link to={`/polls/${poll._id}`}>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {poll.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusPill status={displayStatus} />
              <span className="text-xs text-muted-foreground">• {poll.visibility.charAt(0).toUpperCase() + poll.visibility.slice(1)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(poll)}
            className={`h-8 w-8 p-0 ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
            title={canEdit ? "Edit Poll" : "Edit Restricted"}
          >
            <Edit className="size-4" />
          </Button>
          {!isExpired && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggleStatus(poll)}
              className={`h-8 w-8 p-0 ${poll.status === "active" ? "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10" : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"}`}
              title={poll.status === "active" ? "Close Poll" : "Re-open Poll"}
            >
              {poll.status === "active" ? <Lock className="size-4" /> : <Unlock className="size-4" />}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(poll._id)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Delete Poll"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/50 pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Responses</p>
          <p className="mt-0.5 text-lg font-semibold">{poll.responseCount || 0}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Completion</p>
          <p className="mt-0.5 text-lg font-semibold">
            {poll.viewCount > 0 
              ? `${Math.min(100, Math.round((poll.responseCount / poll.viewCount) * 100))}%` 
              : "0%"}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Created</p>
          <p className="mt-0.5 text-lg font-semibold">
            {poll.createdAt ? formatDistanceToNow(new Date(poll.createdAt)) : "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" />
          Updated {poll.updatedAt ? formatDistanceToNow(new Date(poll.updatedAt)) : "N/A"} ago
        </span>
        <Link to={`/polls/${poll._id}`} className="inline-flex items-center gap-1 font-medium text-foreground hover:underline">
          Manage Poll <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
