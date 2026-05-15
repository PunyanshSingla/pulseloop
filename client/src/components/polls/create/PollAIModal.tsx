import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PollAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  setPrompt: (val: string) => void;
  mode: "replace" | "append";
  setMode: (val: "replace" | "append") => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function PollAIModal({ 
  isOpen, 
  onClose, 
  prompt, 
  setPrompt, 
  mode, 
  setMode, 
  isGenerating, 
  onGenerate 
}: PollAIModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isGenerating && onClose()}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Generate with Gemini AI</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Enter a topic and our AI will draft a complete poll for you.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-prompt" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Poll Topic or Description</Label>
                  <textarea 
                    id="ai-prompt"
                    placeholder="e.g. Employee satisfaction survey for a tech company, or A fun poll about favorite summer vacation spots..."
                    className="min-h-[120px] w-full rounded-xl border border-border bg-muted/30 p-4 text-sm outline-none ring-primary/10 transition-all focus:border-primary/50 focus:ring-4"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generation Mode</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={mode === "replace" ? "default" : "outline"}
                      className="rounded-xl"
                      onClick={() => setMode("replace")}
                      disabled={isGenerating}
                    >
                      Replace Poll
                    </Button>
                    <Button
                      type="button"
                      variant={mode === "append" ? "default" : "outline"}
                      className="rounded-xl"
                      onClick={() => setMode("append")}
                      disabled={isGenerating}
                    >
                      Add Questions
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={onClose}
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 rounded-xl font-bold gap-2"
                    onClick={onGenerate}
                    disabled={isGenerating || !prompt.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        {mode === "append" ? "Add Questions" : "Generate Poll"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
