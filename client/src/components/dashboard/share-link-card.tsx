import { Globe, Copy } from "lucide-react";
import { usePolls } from "@/hooks/use-polls";
import { toast } from "sonner";

export function ShareLinkCard() {
  const { data: pollsResponse } = usePolls();
  const latestPoll = pollsResponse?.data?.[0];
  
  const shareLink = latestPoll 
    ? `${import.meta.env.VITE_APP_ORIGIN}/vote/${latestPoll._id}`
    : `${import.meta.env.VITE_APP_ORIGIN.replace(/^https?:\/\//, "")}/vote/your-poll`;

  const copyLink = () => {
    if (!latestPoll) return;
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">Quick share</p>
        <Globe className="size-5 text-muted-foreground" />
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {latestPoll ? `Share your latest poll: ${latestPoll.title}` : "Send your latest poll anywhere."}
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-3.5 py-2.5 font-mono text-xs">
        <span className="truncate">{shareLink.replace(/^https?:\/\//, "")}</span>
        <button 
          onClick={copyLink}
          disabled={!latestPoll}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          <Copy className="size-3.5" /> Copy
        </button>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
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
