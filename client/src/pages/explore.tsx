import { usePublicPolls } from "@/hooks/use-polls";
import type { Poll } from "@/types/polls";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  Search, 
  BarChart3, 
  Users, 
  ArrowRight,
  Clock,
  LayoutGrid,
  List,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Logo } from "@/components/logo";

export default function ExplorePage() {
  const { data: session } = authClient.useSession();
  const { data: pollsResponse, isLoading } = usePublicPolls();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const polls = pollsResponse?.data || [];
  const filteredPolls = polls.filter((poll: Poll) => 
    poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (poll.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 items-center justify-between px-6 max-w-7xl">
          <Logo />
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <Button asChild variant="ghost" className="text-sm font-medium">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Link to="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
            )}
            <Button asChild className="h-9 shadow-sm">
              <Link to={session ? "/polls/create" : "/sign-up"}>
                {session ? "Create Poll" : "Get Started"}
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-border bg-background md:hidden"
            >
              <div className="space-y-1 px-4 py-6">
                <Link
                  to="/"
                  className="block rounded-lg px-3 py-4 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Home
                </Link>
                <div className="pt-4 border-t border-border mt-4 flex flex-col gap-3">
                  {session ? (
                    <Link
                      to="/dashboard"
                      className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-medium text-primary-foreground shadow-sm"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/sign-in"
                        className="flex w-full items-center justify-center rounded-lg px-4 py-3 text-base font-medium text-foreground ring-1 ring-border"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/sign-up"
                        className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-medium text-primary-foreground shadow-sm"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="mx-auto px-6 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary mb-6"
          >
            <Sparkles className="size-3" />
            Live Public Feed
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Explore <span className="text-primary">Pulse</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover active polls from the community, share your opinion, and see real-time insights from around the world.
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-4 rounded-2xl shadow-sm border border-border">
          <div className="relative flex-1 w-full md:max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <input
              type="text"
              placeholder="Search polls by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-muted/50 border border-border/50 rounded-xl pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            <div className="flex items-center rounded-lg border border-border bg-background p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`rounded-md p-1.5 transition-all ${
                  viewMode === "cards" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`rounded-md p-1.5 transition-all ${
                  viewMode === "table" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[240px] rounded-2xl bg-muted animate-pulse border border-border" />
            ))}
          </div>
        ) : filteredPolls.length === 0 ? (
          <div className="py-24 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <BarChart3 className="size-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No polls found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms to find what you're looking for.</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={viewMode === "cards" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
          >
            {filteredPolls.map((poll: Poll) => (
              <motion.div key={poll._id} variants={item}>
                {viewMode === "cards" ? (
                  <Link 
                    to={`/vote/${poll._id}`}
                    className="group flex flex-col h-full bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <ArrowRight className="size-4" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-colors">
                        <BarChart3 className="size-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          <Users className="size-3" />
                          {poll.responseCount || 0} responses
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">
                      {poll.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-grow">
                      {poll.description || "Take this poll to share your insights."}
                    </p>

                    <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        {formatDistanceToNow(new Date(poll.createdAt))} ago
                      </div>
                      <span className="text-xs font-bold text-primary group-hover:underline">Vote Now</span>
                    </div>
                  </Link>
                ) : (
                  <Link 
                    to={`/vote/${poll._id}`}
                    className="flex items-center justify-between bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
                        <BarChart3 className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{poll.title}</h3>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(poll.createdAt))} ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs font-bold text-foreground">{poll.responseCount || 0}</p>
                        <p className="text-[10px] uppercase text-muted-foreground">Responses</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                        Vote
                      </Button>
                    </div>
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24 px-6 py-12 bg-card">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PulseLoop. Built for modern feedback loops.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/sign-in" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link to="/sign-up" className="hover:text-foreground transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
