import { motion } from "framer-motion";
import { Copy } from "lucide-react";

export function ShareStrip() {
  return (
    <div className="bg-zinc-900 py-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6">
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
          Shareable Link System
        </span>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 rounded-md bg-zinc-800 px-3 py-1.5 ring-1 ring-white/10 cursor-pointer"
        >
          <code className="text-sm text-emerald-400">
            {typeof window !== 'undefined' ? window.location.host : 'pulseloop.io'}/vote/6k2p9
          </code>
          <button className="text-zinc-500 transition-colors hover:text-white" aria-label="Copy link">
            <Copy className="size-4" />
          </button>
        </motion.div>
        <div className="hidden h-4 w-px bg-zinc-700 sm:block" />
        <span className="text-sm text-zinc-400">
          Share anywhere with a single, secure link
        </span>
      </div>
    </div>
  );
}
