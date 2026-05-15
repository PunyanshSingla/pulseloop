import { Button } from "@/components/ui/button";
import { 
  QrCode, 
  Share2, 
  ExternalLink, 
  Globe, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Trash2 
} from "lucide-react";
import { Link } from "react-router-dom";

import type { Poll } from "@/types/polls";

interface PollHeaderProps {
  poll: Poll;
  isPublishing: boolean;
  onCopyLink: () => void;
  onToggleStatus: () => void;
  onShowQR: () => void;
  onShowPublish: () => void;
  onShowDelete: () => void;
}

export const PollHeader = ({
  poll,
  isPublishing,
  onCopyLink,
  onToggleStatus,
  onShowQR,
  onShowPublish,
  onShowDelete
}: PollHeaderProps) => {
  return (
    <div className="space-y-8">
      {/* Breadcrumbs / Back */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <Link to="/polls" className="hover:text-foreground transition-colors">Polls</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{poll.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{poll.title}</h1>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              poll.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
            }`}>
              {poll.status === "active" && <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />}
              {poll.status}
            </span>
          </div>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">{poll.description || "No description provided."}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2 rounded-xl text-xs" onClick={onShowQR}>
            <QrCode className="size-3.5 md:size-4" />
            QR Code
          </Button>
          <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2 rounded-xl text-xs" onClick={onCopyLink}>
            <Share2 className="size-3.5 md:size-4" />
            Share
          </Button>
          <Button size="sm" className="flex-1 md:flex-none gap-2 rounded-xl text-xs" asChild>
            <a href={`${import.meta.env.VITE_APP_ORIGIN}/vote/${poll._id}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5 md:size-4" />
              Live Preview
            </a>
          </Button>
          {!poll.resultsPublished ? (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 md:flex-none gap-2 rounded-xl border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500 text-xs" 
              onClick={onShowPublish}
              disabled={isPublishing}
            >
              <Globe className="size-3.5 md:size-4" />
              Publish Results
            </Button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-[10px] md:text-xs font-bold text-emerald-500">
              <ShieldCheck className="size-3.5 md:size-4" />
              Results Published
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex-1 md:flex-none gap-2 rounded-xl text-xs ${poll.status === "active" ? "text-amber-600 border-amber-600/20 hover:bg-amber-600/5" : "text-emerald-600 border-emerald-600/20 hover:bg-emerald-600/5"}`}
            onClick={onToggleStatus}
          >
            {poll.status === "active" ? (
              <><Lock className="size-3.5 md:size-4" /> Close</>
            ) : (
              <><CheckCircle2 className="size-3.5 md:size-4" /> Re-open</>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="size-9 rounded-xl border-destructive/20 text-muted-foreground hover:text-destructive hover:bg-destructive/5 shrink-0"
            onClick={onShowDelete}
          >
            <Trash2 className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
