import React, { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
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
                <span className="flex size-3 items-center justify-center rounded-full bg-destructive/20">
                    <span className="size-1.5 rounded-full bg-destructive" />
                </span>
                <span>System Error</span>
              </div>
              
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl flex flex-col sm:flex-row items-center justify-center gap-4">
                <AlertTriangle className="size-10 text-destructive md:size-14" />
                Oops! Something went wrong
              </h1>
              
              <div className="mx-auto mb-10 max-w-[50ch] text-balance text-lg text-muted-foreground">
                <p>An unexpected error has occurred in the application.</p>
                {this.state.error && (
                  <div className="mt-4 text-left">
                    <p className="text-xs mb-1 font-semibold text-destructive/80">Error details:</p>
                    <div className="text-sm text-destructive/80 font-mono bg-destructive/10 p-3 rounded-md truncate max-w-full overflow-hidden border border-destructive/20">
                      {this.state.error.message}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm ring-1 ring-primary/30 transition-all hover:brightness-110"
                >
                  <RefreshCcw className="size-4" />
                  Reload Page
                </button>
                <Link
                  to="/"
                  onClick={() => this.setState({ hasError: false })}
                  className="inline-flex items-center gap-2 rounded-lg bg-card px-6 py-3 text-sm font-medium text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-all hover:ring-black/10 dark:hover:ring-white/20"
                >
                  <Home className="size-4" />
                  Back to Home
                </Link>
              </div>
            </div>
          </main>

          <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} PulseLoop Inc. All rights reserved.</p>
          </footer>
        </div>
      );
    }

    return this.props.children;
  }
}
