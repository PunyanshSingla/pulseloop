import { Globe, QrCode, Share2 } from "lucide-react";
import { usePolls } from "@/hooks/use-polls";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import { Logo } from "@/components/logo";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ShareLinkCard() {
  const { data: pollsResponse } = usePolls();
  const latestPoll = pollsResponse?.data?.[0];
  const [showQR, setShowQR] = useState(false);
  
  const shareLink = latestPoll 
    ? `${import.meta.env.VITE_APP_ORIGIN}/vote/${latestPoll._id}`
    : `${import.meta.env.VITE_APP_ORIGIN.replace(/^https?:\/\//, "")}/vote/your-poll`;

  const handleShare = async () => {
    if (!latestPoll) return;

    const shareData = {
      title: latestPoll.title,
      text: `Check out this poll on PulseLoop: ${latestPoll.title}`,
      url: shareLink,
    };

    // Use native share API if available
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard if native share fails or is cancelled
        navigator.clipboard.writeText(shareLink);
        toast.success("Link copied to clipboard!");
      }
    } else {
      // Fallback to clipboard if native share is not available
      navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">Quick share</p>
        <div className="flex items-center gap-2">
          {latestPoll && (
            <button 
              onClick={() => setShowQR(!showQR)} 
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle QR Code"
            >
              <QrCode className="size-5" />
            </button>
          )}
          <Globe className="size-5 text-muted-foreground" />
        </div>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {latestPoll ? `Share your latest poll: ${latestPoll.title}` : "Send your latest poll anywhere."}
      </p>
      
      {showQR && latestPoll && (
        <div className="mt-4 flex flex-col items-center justify-center p-4 bg-card rounded-xl border border-border shadow-sm">
          <div className="mb-3">
            <Logo className="scale-75" noLink />
          </div>
          
          <div className="p-3 bg-white rounded-lg shadow-inner mb-3">
            <QRCodeCanvas 
              id="dash-poll-qr"
              value={shareLink} 
              size={140} 
              level="H"
            />
          </div>
          
          <Button 
            variant="outline" 
            size="xs" 
            className="w-full gap-2 rounded-lg h-8"
            onClick={async () => {
              const canvas = document.getElementById("dash-poll-qr") as HTMLCanvasElement;
              if (!canvas) return;

              const downloadCanvas = document.createElement("canvas");
              const ctx = downloadCanvas.getContext("2d");
              if (!ctx) return;

              const size = 1000;
              downloadCanvas.width = size;
              downloadCanvas.height = size + 300;
              
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);
              
              ctx.fillStyle = "#10b981";
              ctx.font = "bold 60px sans-serif";
              ctx.textAlign = "center";
              ctx.fillText("PulseLoop", size / 2, 100);
              
              ctx.fillStyle = "#000000";
              ctx.font = "bold 44px sans-serif";
              ctx.fillText(latestPoll.title, size / 2, 180);
              
              ctx.drawImage(canvas, 100, 250, 800, 800);
              
              const dataUrl = downloadCanvas.toDataURL("image/png");
              
              if (navigator.share) {
                try {
                  const blob = await (await fetch(dataUrl)).blob();
                  const file = new File([blob], `poll-${latestPoll._id}.png`, { type: "image/png" });
                  await navigator.share({
                    files: [file],
                    title: latestPoll.title,
                  });
                  toast.success("Branded QR Shared!");
                  return;
                } catch {
                  // Fallback to direct download
                }
              }

              const link = document.createElement("a");
              link.download = `poll-${latestPoll._id}.png`;
              link.href = dataUrl;
              link.click();
              toast.success("QR Code Downloaded!");
            }}
          >
            <Share2 className="size-3" />
            Share Image
          </Button>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 font-mono text-xs">
        <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide py-0.5">
          {shareLink.replace(/^https?:\/\//, "")}
        </div>
        <button
          onClick={handleShare}
          disabled={!latestPoll}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1.5 text-[10px] font-bold text-background hover:opacity-90 disabled:opacity-50"
        >
          <Share2 className="size-3" /> Share
        </button>
      </div>
    </div>
  );
}
