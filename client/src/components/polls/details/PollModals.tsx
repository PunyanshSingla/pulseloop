import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Globe, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";

interface PollModalsProps {
  poll: any;
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  confirmDelete: () => void;
  showPublishModal: boolean;
  setShowPublishModal: (show: boolean) => void;
  confirmPublish: () => void;
  showQRModal: boolean;
  setShowQRModal: (show: boolean) => void;
}

export const PollModals = ({
  poll,
  showDeleteModal,
  setShowDeleteModal,
  confirmDelete,
  showPublishModal,
  setShowPublishModal,
  confirmPublish,
  showQRModal,
  setShowQRModal,
}: PollModalsProps) => {
  return (
    <>
      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
              <div className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
                  <AlertTriangle className="size-7" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Delete Poll Permanently?</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  This action will remove all questions and gathered responses for "{poll.title}". You cannot undo this.
                </p>
                <div className="mt-8 flex w-full flex-col gap-2 sm:flex-row">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1 rounded-xl font-bold"
                    onClick={confirmDelete}
                  >
                    Confirm Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Publish Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPublishModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
              <div className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 grid size-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Globe className="size-7" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Publish Results?</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Publishing will close the poll and make the analytics visible to anyone with the results link.
                </p>
                <div className="mt-8 flex w-full flex-col gap-2 sm:flex-row">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={() => setShowPublishModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600"
                    onClick={confirmPublish}
                  >
                    Publish Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQRModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl flex flex-col items-center"
            >
              <div id="qr-share-card" className="w-full bg-card p-6 flex flex-col items-center text-center">
                <div className="mb-4">
                  <Logo className="scale-90" noLink />
                </div>
                
                <h2 className="text-base font-bold tracking-tight mb-1 line-clamp-1">{poll.title}</h2>
                <p className="text-[10px] text-muted-foreground mb-4">Scan to cast your vote</p>
                
                <div className="bg-white p-3 rounded-xl shadow-sm border border-border/50 mb-4">
                  <QRCodeCanvas 
                    id="poll-qr-canvas"
                    value={`${import.meta.env.VITE_APP_ORIGIN}/vote/${poll._id}`} 
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                
                <p className="text-[9px] font-mono text-muted-foreground truncate w-full opacity-60">
                  {import.meta.env.VITE_APP_ORIGIN.replace(/^https?:\/\//, "")}/vote/{poll._id}
                </p>
              </div>

              <div className="w-full p-4 bg-muted/30 border-t border-border/50 grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-xl gap-2 h-9"
                  onClick={async () => {
                    const canvas = document.getElementById("poll-qr-canvas") as HTMLCanvasElement;
                    if (!canvas) return;

                    const downloadCanvas = document.createElement("canvas");
                    const ctx = downloadCanvas.getContext("2d");
                    if (!ctx) return;

                    const size = 1000; // High res
                    downloadCanvas.width = size;
                    downloadCanvas.height = size + 350;
                    
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);
                    
                    ctx.fillStyle = "#10b981"; 
                    ctx.font = "bold 60px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText("PulseLoop", size / 2, 100);
                    
                    ctx.fillStyle = "#000000";
                    ctx.font = "bold 44px sans-serif";
                    ctx.fillText(poll.title, size / 2, 180);
                    
                    ctx.fillStyle = "#666666";
                    ctx.font = "30px sans-serif";
                    ctx.fillText("Scan to cast your vote", size / 2, 240);
                    
                    ctx.drawImage(canvas, 100, 300, 800, 800);
                    
                    ctx.fillStyle = "#999999";
                    ctx.font = "24px monospace";
                    ctx.fillText(import.meta.env.VITE_APP_ORIGIN.replace(/^https?:\/\//, "") + "/vote/" + poll._id, size / 2, size + 280);

                    const dataUrl = downloadCanvas.toDataURL("image/png");
                    
                    if (navigator.share && navigator.canShare) {
                      try {
                        const blob = await (await fetch(dataUrl)).blob();
                        const file = new File([blob], `poll-qr-${poll._id}.png`, { type: "image/png" });
                        
                        if (navigator.canShare({ files: [file] })) {
                          await navigator.share({
                            files: [file],
                            title: `Poll: ${poll.title}`,
                            text: `Scan this QR code to vote on my poll: ${poll.title}`,
                          });
                          toast.success("Branded QR Shared!");
                          return;
                        }
                      } catch (err) {
                        console.error("Share failed", err);
                      }
                    }

                    const link = document.createElement("a");
                    link.download = `poll-qr-${poll.title.toLowerCase().replace(/\s+/g, "-")}.png`;
                    link.href = dataUrl;
                    link.click();
                    toast.success("QR Code Downloaded!");
                  }}
                >
                  <Share2 className="size-4" />
                  Share Image
                </Button>
                <Button 
                  variant="default" 
                  className="rounded-xl"
                  onClick={() => setShowQRModal(false)}
                >
                  Done
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
