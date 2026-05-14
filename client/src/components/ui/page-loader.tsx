import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface PageLoaderProps {
  message?: string;
}

export const PageLoader = ({ message = "Loading Experience..." }: PageLoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="relative">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
        />
        <Loader2 className="size-10 animate-spin text-primary relative z-10" />
      </div>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-xs font-black text-muted-foreground uppercase tracking-[0.2em] animate-pulse text-center"
      >
        {message}
      </motion.p>
    </div>
  );
};
