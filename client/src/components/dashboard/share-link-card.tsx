import { Globe, Copy } from "lucide-react";
import { usePolls } from "@/hooks/use-polls";
import { toast } from "sonner";

export function ShareLinkCard() {
  const { data: pollsResponse } = usePolls();
  const latestPoll = pollsResponse?.data?.[0];
  
  const shareLink = latestPoll 
    ? `${window.location.origin}/p/${latestPoll._id}`
    : "pulseloop.io/p/your-poll";

  const copyLink = () => {
    if (!latestPoll) return;
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Quick share</p>
        <Globe className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {latestPoll ? `Share your latest poll: ${latestPoll.title}` : "Send your latest poll anywhere."}
      </p>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 font-mono text-[10px]">
        <span className="truncate">{shareLink.replace(/^https?:\/\//, "")}</span>
        <button 
          onClick={copyLink}
          disabled={!latestPoll}
          className="ml-auto inline-flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          <Copy className="size-3" /> Copy
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        {["Slack", "Email", "X / Twitter"].map((c) => (
          <button
            key={c}
            className="rounded-lg border border-border bg-background py-2 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
