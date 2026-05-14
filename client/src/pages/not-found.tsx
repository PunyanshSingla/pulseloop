import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Simple Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Logo />
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
            <span className="size-1.5 rounded-full bg-destructive" />
            <span>Error 404</span>
          </div>
          
          <h1 className="mb-6 text-6xl font-bold tracking-tight md:text-8xl">
            Lost in the <span className="text-primary">Loop</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-[40ch] text-balance text-lg text-muted-foreground">
            The page you're looking for has drifted off the radar. 
            It might have been moved, deleted, or never existed in this pulse.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm ring-1 ring-primary/30 transition-all hover:brightness-110"
            >
              <Home className="size-4" />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-lg bg-card px-6 py-3 text-sm font-medium text-foreground shadow-sm ring-1 ring-black/5 transition-all hover:ring-black/10"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} PulseLoop Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
