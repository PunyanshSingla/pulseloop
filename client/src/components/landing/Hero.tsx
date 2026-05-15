import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { PollMockup } from "./PollMockup";

interface HeroProps {
  session: any;
}

export function Hero({ session }: HeroProps) {
  return (
    <section className="px-6 pt-24 pb-16 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />
      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            <span>Now in public beta</span>
          </motion.div>
          <h1 className="mx-auto mb-6 max-w-[24ch] text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Create Simple Polls and Get Real Answers Fast
          </h1>
          <p className="mx-auto mb-10 max-w-[56ch] text-pretty text-base text-muted-foreground sm:text-lg">
            PulseLoop is the easiest way to get feedback from your audience. 
            Create a poll in seconds, share a link, and see results instantly.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {!session ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/sign-up"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground ring-1 ring-primary/30 transition-all hover:brightness-110 sm:w-auto"
                >
                  <Plus className="size-4" />
                  Create your first poll
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/polls/create"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground ring-1 ring-primary/30 transition-all hover:brightness-110 sm:w-auto"
                >
                  <Plus className="size-4" />
                  Create new poll
                </Link>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <a
                href="#demo"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-black/5 transition-all hover:ring-black/10 sm:w-auto"
              >
                Watch Demo
              </a>
            </motion.div>

          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <PollMockup />
        </motion.div>
      </div>
    </section>
  );
}
