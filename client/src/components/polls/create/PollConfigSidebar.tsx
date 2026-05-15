import { Settings2, Globe, Lock, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PollConfigSidebarProps {
  onSave: () => void;
  isPending: boolean;
  isEditing: boolean;
  visibility: "public" | "private";
  setVisibility: (val: "public" | "private") => void;
  allowAnonymous: boolean;
  setAllowAnonymous: (val: boolean) => void;
  allowMultipleSubmissions: boolean;
  setAllowMultipleSubmissions: (val: boolean) => void;
  startsAt: string;
  setStartsAt: (val: string) => void;
  expiresAt: string;
  setExpiresAt: (val: string) => void;
}

export function PollConfigSidebar({
  onSave,
  isPending,
  isEditing,
  visibility,
  setVisibility,
  allowAnonymous,
  setAllowAnonymous,
  allowMultipleSubmissions,
  setAllowMultipleSubmissions,
  startsAt,
  setStartsAt,
  expiresAt,
  setExpiresAt
}: PollConfigSidebarProps) {
  return (
    <div className="w-full lg:w-80 shrink-0">
      <div className="sticky top-6 space-y-6">
        <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Settings2 className="size-4 text-primary" />
            Poll Actions
          </h3>
          
          <div className="space-y-3 pt-2">
            <Button 
              className="w-full h-11 font-bold shadow-lg shadow-primary/20"
              onClick={onSave}
              disabled={isPending}
            >
              {isPending ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Create Poll")}
            </Button>
          </div>

          <div className="h-px bg-border my-2" />

          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Globe className="size-4 text-primary" />
            Configuration
          </h3>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium">
                <Globe className="size-3.5 text-muted-foreground" />
                Public access
              </div>
              <button 
                type="button"
                onClick={() => setVisibility(visibility === "public" ? "private" : "public")}
                className={`h-4 w-8 rounded-full p-0.5 transition-colors ${visibility === "public" ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${visibility === "public" ? "translate-x-4" : ""}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium">
                <Lock className="size-3.5 text-muted-foreground" />
                Allow Guest Voting
              </div>
              <button 
                type="button"
                onClick={() => setAllowAnonymous(!allowAnonymous)}
                className={`h-4 w-8 rounded-full p-0.5 transition-colors ${allowAnonymous ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${allowAnonymous ? "translate-x-4" : ""}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium">
                <CheckCircle2 className="size-3.5 text-muted-foreground" />
                Multi-Submission
              </div>
              <button 
                type="button"
                onClick={() => setAllowMultipleSubmissions(!allowMultipleSubmissions)}
                className={`h-4 w-8 rounded-full p-0.5 transition-colors ${allowMultipleSubmissions ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${allowMultipleSubmissions ? "translate-x-4" : ""}`} />
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-border mt-2">
              <Label htmlFor="startsAt" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Start Date</Label>
              <Input 
                id="startsAt"
                type="datetime-local"
                className="h-9 text-xs bg-muted/20"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">End Date</Label>
              <Input 
                id="expiresAt"
                type="datetime-local"
                className="h-9 text-xs bg-muted/20"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold mb-2">
            <Sparkles className="size-4 text-primary" />
            Pro Tip
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Allowing Guest Voting (Anonymous) usually increases response rates by over 50%.
          </p>
        </div>
      </div>
    </div>
  );
}
