import { authClient } from "@/lib/auth-client";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  BarChart3, 
  Clock, 
  CheckCircle2,
  Calendar,
  Eye,
  ArrowUpRight,
  LayoutGrid,
  List,
  X
} from "lucide-react";
import { usePolls } from "@/hooks/use-polls";
import { formatDistanceToNow } from "date-fns";

export default function PollsPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: pollsResponse, isLoading: isPollsLoading, error: pollsError } = usePolls();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");

  const isPending = isSessionPending || isPollsLoading;
  const polls = pollsResponse?.data || [];

  const filteredPolls = polls.filter((poll: any) => 
    poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poll.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poll.visibility.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    navigate("/sign-in");
    return null;
  }

  if (pollsError) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar user={session.user} />
        <div className="flex flex-1 flex-col">
          <Topbar userName={session.user.name} />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive mx-auto mb-4">
                <X className="size-6" />
              </div>
              <h3 className="font-semibold text-lg">Failed to load polls</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-xs">
                {(pollsError as any)?.message || "There was an error connecting to the server. Please try again."}
              </p>
              <Button onClick={() => window.location.reload()} className="gap-2">
                <Plus className="size-4 rotate-45" />
                Retry loading
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={session.user} />
      
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userName={session.user.name} />
        
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Polls</h1>
                <p className="text-sm text-muted-foreground">Manage and track your active and past polls.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="mr-2 flex items-center rounded-lg border border-border bg-background p-0.5">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`rounded-md p-1.5 transition-colors ${
                      viewMode === "cards" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Card View"
                  >
                    <LayoutGrid className="size-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`rounded-md p-1.5 transition-colors ${
                      viewMode === "table" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Table View"
                  >
                    <List className="size-4" />
                  </button>
                </div>
                <Button variant="outline" className="h-9 gap-2">
                  <Filter className="size-4" />
                  Filter
                </Button>
                <Button className="h-9 gap-2" onClick={() => navigate("/polls/create")}>
                  <Plus className="size-4" />
                  New poll
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search polls by name, type or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Polls List */}
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredPolls.length === 0 ? (
                  <div className="lg:col-span-2 flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
                    <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground mb-4">
                      <BarChart3 className="size-6" />
                    </div>
                    <h3 className="font-semibold">{searchQuery ? "No matching polls" : "No polls found"}</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      {searchQuery ? "Try adjusting your search terms." : "Create your first poll to start gathering insights."}
                    </p>
                    {!searchQuery && <Button onClick={() => navigate("/polls/create")}>Create Poll</Button>}
                  </div>
                ) : filteredPolls.map((poll: any) => (
                  <div key={poll._id} className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-lg bg-muted text-muted-foreground">
                          <BarChart3 className="size-5" />
                        </div>
                        <div>
                          <Link to={`/polls/${poll._id}`}>
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {poll.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StatusPill status={poll.status.charAt(0).toUpperCase() + poll.status.slice(1)} />
                            <span className="text-xs text-muted-foreground">• {poll.visibility.charAt(0).toUpperCase() + poll.visibility.slice(1)}</span>
                          </div>
                        </div>
                      </div>
                      <button className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <MoreHorizontal className="size-5" />
                      </button>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/50 pt-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Responses</p>
                        <p className="mt-0.5 text-lg font-semibold">{poll.responseCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Completion</p>
                        <p className="mt-0.5 text-lg font-semibold">
                          {poll.viewCount > 0 
                            ? `${Math.min(100, Math.round((poll.responseCount / poll.viewCount) * 100))}%` 
                            : "0%"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Created</p>
                        <p className="mt-0.5 text-lg font-semibold">{formatDistanceToNow(new Date(poll.createdAt))}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        Updated {formatDistanceToNow(new Date(poll.updatedAt))} ago
                      </span>
                      <Link to={`/polls/${poll._id}`} className="inline-flex items-center gap-1 font-medium text-foreground hover:underline">
                        Manage Poll <ArrowUpRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted-foreground">
                        <th className="px-5 py-3.5 font-medium">Poll</th>
                        <th className="px-5 py-3.5 font-medium">Status</th>
                        <th className="px-5 py-3.5 font-medium">Type</th>
                        <th className="px-5 py-3.5 text-right font-medium">Responses</th>
                        <th className="px-5 py-3.5 text-right font-medium">Completion</th>
                        <th className="px-5 py-3.5 font-medium">Updated</th>
                        <th className="px-5 py-3.5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPolls.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                            {searchQuery ? "No polls match your search." : "No polls found. Create your first poll to start gathering insights."}
                          </td>
                        </tr>
                      ) : filteredPolls.map((p: any) => (
                        <tr key={p._id} className="border-b border-border/70 last:border-0 transition-colors hover:bg-muted/40">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="grid size-8 place-items-center rounded-md bg-muted text-muted-foreground">
                                <BarChart3 className="size-4" />
                              </div>
                              <Link to={`/polls/${p._id}`} className="font-medium hover:text-primary transition-colors">
                                {p.title}
                              </Link>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusPill status={p.status.charAt(0).toUpperCase() + p.status.slice(1)} />
                          </td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.visibility.charAt(0).toUpperCase() + p.visibility.slice(1)}</td>
                          <td className="px-5 py-3.5 text-right tabular-nums">{p.responseCount || 0}</td>
                          <td className="px-5 py-3.5 text-right tabular-nums">
                            {p.viewCount > 0 
                              ? `${Math.min(100, Math.round((p.responseCount / p.viewCount) * 100))}%` 
                              : "0%"}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground">{formatDistanceToNow(new Date(p.updatedAt))} ago</td>
                          <td className="px-5 py-3.5 text-right">
                            <button className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                              <MoreHorizontal className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    Live: { cls: "bg-accent text-accent-foreground", icon: <span className="size-1.5 rounded-full bg-primary" /> },
    Draft: { cls: "bg-muted text-muted-foreground", icon: <Clock className="size-3" /> },
    Closed: { cls: "bg-foreground/5 text-foreground/70", icon: <CheckCircle2 className="size-3" /> },
  };
  const s = map[status] || map.Draft;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.cls}`}>
      {s.icon}
      {status}
    </span>
  );
}
