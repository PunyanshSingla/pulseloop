import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface CTAProps {
  session: any;
}

export function CTA({ session }: CTAProps) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl rounded-2xl bg-primary p-12 text-center md:p-20">
        <h2 className="mb-6 text-3xl font-semibold text-primary-foreground md:text-4xl">
          Ready to start collecting?
        </h2>
        <p className="mx-auto mb-10 max-w-[48ch] text-lg text-primary-foreground/80">
          Join the growing community of creators making data-driven decisions every day.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {!session ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/sign-up"
                  className="w-full rounded-lg bg-card px-8 py-3 text-sm font-medium text-primary shadow-xl ring-1 ring-white/10 sm:w-auto block"
                >
                  Create free account
                </Link>
              </motion.div>
              <Link
                to="/sign-in"
                className="w-full px-8 py-3 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground sm:w-auto"
              >
                Sign in
              </Link>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/dashboard"
                className="w-full rounded-lg bg-card px-8 py-3 text-sm font-medium text-primary shadow-xl ring-1 ring-white/10 sm:w-auto block"
              >
                Go to Dashboard
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
