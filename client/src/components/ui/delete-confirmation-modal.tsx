import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Delete Permanently?",
  description = "This action cannot be undone. All data associated with this item will be removed."
}: DeleteConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              <h2 className="text-xl font-bold tracking-tight">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
              <div className="mt-8 flex w-full flex-col gap-2 sm:flex-row">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 rounded-xl font-bold"
                  onClick={onConfirm}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
