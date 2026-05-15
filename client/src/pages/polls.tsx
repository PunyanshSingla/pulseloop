import { authClient } from "@/lib/auth-client";
import type { Poll } from "@/types/polls";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { 
  Plus, 
  Search, 
  BarChart3, 
  Clock, 
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  LayoutGrid,
  List,
  X,
  Trash2,
  Edit,
  AlertTriangle,
  Lock,
  Unlock
} from "lucide-react";
import { usePolls, useDeletePoll, useUpdatePollAction } from "@/hooks/use-polls";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { LoaderContainer } from "@/components/ui/loader";

export default function PollsPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [page, setPage] = useState(1);
  const limit = 6;
  const { data: pollsResponse, isLoading: isPollsLoading, error: pollsError } = usePolls(page, limit);
  const { mutate: deletePoll } = useDeletePoll();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { mutate: updatePoll } = useUpdatePollAction();

  const isPending = isSessionPending || isPollsLoading;
  const polls = pollsResponse?.data || [];
  const hasMore = polls.length === limit;

  const confirmDelete = () => {
    if (deletingPollId) {
      deletePoll(deletingPollId);
      setDeletingPollId(null);
    }
  };

  const handleEdit = (poll: Poll) => {
    if (poll.status === "closed") {
      return toast.error("Cannot edit a closed poll. Re-open it first if needed.");
    }
    
    if (poll.startsAt && new Date(poll.startsAt) < new Date()) {
      return toast.error("Editing is disabled for active polls to maintain data integrity.");
    }
    
    navigate(`/polls/${poll._id}/edit`);
  };

  const handleToggleStatus = (poll: Poll) => {
    const nextStatus = poll.status === "active" ? "closed" : "active";
    updatePoll({ id: poll._id, data: { status: nextStatus } });
  };

  const canEdit = (poll: Poll) => {
    if (poll.status === "closed") return false;
    if (!poll.startsAt) return true;
    return new Date(poll.startsAt) > new Date();
  };

  const filteredPolls = polls.filter((poll: Poll) => 
    poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poll.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poll.visibility.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isPending && page === 1) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoaderContainer message="Loading your workspace..." />
      </div>
    );
  }

  if (!session) {
    navigate("/sign-in");
    return null;
  }

  if (pollsError) {
    return (
      <div className="flex h-screen bg-background relative overflow-hidden">
        <Sidebar user={session.user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex flex-1 flex-col w-full h-full">
          <Topbar userName={session.user.name} onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive mx-auto mb-4">
                <X className="size-6" />
              </div>
              <h3 className="font-semibold text-lg">Failed to load polls</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-xs">
                {(pollsError as Error).message || "There was an error connecting to the server. Please try again."}
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
    <div className="flex h-screen bg-background text-foreground relative overflow-hidden">
      <Sidebar user={session.user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex min-w-0 flex-1 flex-col w-full h-full">
        <Topbar userName={session.user.name} onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Polls</h1>
                <p className="text-sm text-muted-foreground">Manage and track your active and past polls.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
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
                <Button className="h-9 gap-2 font-bold px-4" onClick={() => navigate("/polls/create")}>
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
                ) : filteredPolls.map((poll: Poll) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={poll._id} 
                    className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm"
                  >
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
                            {(() => {
                              const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date();
                              const isRunning = poll.status === "active" && !isExpired;
                              const displayStatus = isRunning ? "Running" : isExpired ? "Ended" : poll.status.charAt(0).toUpperCase() + poll.status.slice(1);
                              return <StatusPill status={displayStatus} />;
                            })()}
                            <span className="text-xs text-muted-foreground">• {poll.visibility.charAt(0).toUpperCase() + poll.visibility.slice(1)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(poll)}
                          className={`h-8 w-8 p-0 ${!canEdit(poll) ? "opacity-50 cursor-not-allowed" : ""}`}
                          title={canEdit(poll) ? "Edit Poll" : "Edit Restricted"}
                        >
                          <Edit className="size-4" />
                        </Button>
                        {(() => {
                          const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date();
                          if (isExpired) return null;
                          return (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleToggleStatus(poll)}
                              className={`h-8 w-8 p-0 ${poll.status === "active" ? "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10" : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"}`}
                              title={poll.status === "active" ? "Close Poll" : "Re-open Poll"}
                            >
                              {poll.status === "active" ? <Lock className="size-4" /> : <Unlock className="size-4" />}
                            </Button>
                          );
                        })()}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setDeletingPollId(poll._id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete Poll"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
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
                        <p className="mt-0.5 text-lg font-semibold">
                          {poll.createdAt ? formatDistanceToNow(new Date(poll.createdAt)) : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        Updated {poll.updatedAt ? formatDistanceToNow(new Date(poll.updatedAt)) : "N/A"} ago
                      </span>
                      <Link to={`/polls/${poll._id}`} className="inline-flex items-center gap-1 font-medium text-foreground hover:underline">
                        Manage Poll <ArrowUpRight className="size-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Poll</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="text-right">Responses</TableHead>
                      <TableHead className="hidden lg:table-cell text-right">Completion</TableHead>
                      <TableHead className="hidden xl:table-cell">Updated</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPolls.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          {searchQuery ? "No polls match your search." : "No polls found."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPolls.map((p: Poll) => (
                        <TableRow key={p._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="grid size-8 place-items-center rounded-md bg-muted text-muted-foreground">
                                <BarChart3 className="size-4" />
                              </div>
                              <Link to={`/polls/${p._id}`} className="font-medium hover:text-primary transition-colors">
                                {p.title}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <StatusPill status={p.status.charAt(0).toUpperCase() + p.status.slice(1)} />
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{p.visibility.charAt(0).toUpperCase() + p.visibility.slice(1)}</TableCell>
                          <TableCell className="text-right tabular-nums font-semibold">{p.responseCount || 0}</TableCell>
                          <TableCell className="hidden lg:table-cell text-right tabular-nums">
                            {p.viewCount > 0 
                              ? `${Math.min(100, Math.round((p.responseCount / p.viewCount) * 100))}%` 
                              : "0%"}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                            {p.updatedAt ? formatDistanceToNow(new Date(p.updatedAt)) : "N/A"} ago
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEdit(p)}
                                className={`h-7 w-7 p-0 ${!canEdit(p) ? "opacity-50 cursor-not-allowed" : ""}`}
                                title={canEdit(p) ? "Edit Poll" : "Edit Restricted"}
                              >
                                <Edit className="size-3.5" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleToggleStatus(p)}
                                className={`h-7 w-7 p-0 ${p.status === "active" ? "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10" : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"}`}
                                title={p.status === "active" ? "Close Poll" : "Re-open Poll"}
                              >
                                {p.status === "active" ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setDeletingPollId(p._id)}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                title="Delete Poll"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination Controls */}
            {polls.length > 0 && (
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-border/50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || isPollsLoading}
                  className="rounded-lg px-4"
                >
                  Previous
                </Button>
                <span className="text-sm font-bold bg-muted px-3 py-1 rounded-md">Page {page}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasMore || isPollsLoading}
                  className="rounded-lg px-4"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingPollId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingPollId(null)}
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
                <h2 className="text-xl font-bold tracking-tight">Delete Poll Permanently?</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  This action will remove all questions and gathered responses. You cannot undo this once confirmed.
                </p>
                <div className="mt-8 flex w-full flex-col gap-2 sm:flex-row">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={() => setDeletingPollId(null)}
                  >
                    Keep Poll
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1 rounded-xl font-bold"
                    onClick={confirmDelete}
                  >
                    Delete Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    Running: { cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" /> },
    Ended: { cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400", icon: <Calendar className="size-3" /> },
    Active: { cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" /> },
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
