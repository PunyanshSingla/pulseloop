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

interface PollHeaderProps {
  poll: any;
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
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{poll.title}</h1>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              poll.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
            }`}>
              {poll.status === "active" && <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />}
              {poll.status}
            </span>
          </div>
          <p className="text-muted-foreground max-w-2xl">{poll.description || "No description provided."}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={onShowQR}>
            <QrCode className="size-4" />
            QR Code
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={onCopyLink}>
            <Share2 className="size-4" />
            Share
          </Button>
          <Button size="sm" className="gap-2 rounded-xl" asChild>
            <a href={`${import.meta.env.VITE_APP_ORIGIN}/vote/${poll._id}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" />
              Live Preview
            </a>
          </Button>
          {!poll.resultsPublished ? (
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-2 rounded-xl border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500" 
              onClick={onShowPublish}
              disabled={isPublishing}
            >
              <Globe className="size-4" />
              Publish Results
            </Button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-bold text-emerald-500">
              <ShieldCheck className="size-4" />
              Results Published
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className={`gap-2 rounded-xl ${poll.status === "active" ? "text-amber-600 border-amber-600/20 hover:bg-amber-600/5" : "text-emerald-600 border-emerald-600/20 hover:bg-emerald-600/5"}`}
            onClick={onToggleStatus}
          >
            {poll.status === "active" ? (
              <><Lock className="size-4" /> Close Poll</>
            ) : (
              <><CheckCircle2 className="size-4" /> Re-open Poll</>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="size-9 rounded-xl border-destructive/20 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
            onClick={onShowDelete}
          >
            <Trash2 className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
