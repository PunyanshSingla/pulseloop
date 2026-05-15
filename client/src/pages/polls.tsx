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
  LayoutGrid, 
  List, 
  X
} from "lucide-react";
import { usePolls, useDeletePoll, useUpdatePollAction } from "@/hooks/use-polls";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LoaderContainer } from "@/components/ui/loader";
import { PollCard } from "@/components/polls/poll-card";
import { PollTable } from "@/components/polls/poll-table";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

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
      return toast.error("Cannot edit a closed poll.");
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
                  <PollCard 
                    key={poll._id}
                    poll={poll}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                    onDelete={(id) => setDeletingPollId(id)}
                    canEdit={canEdit(poll)}
                  />
                ))}
              </div>
            ) : (
              <PollTable 
                polls={filteredPolls}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={(id) => setDeletingPollId(id)}
                canEdit={canEdit}
                searchQuery={searchQuery}
              />
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

      <DeleteConfirmationModal 
        isOpen={!!deletingPollId}
        onClose={() => setDeletingPollId(null)}
        onConfirm={confirmDelete}
        title="Delete Poll Permanently?"
        description="This action will remove all questions and gathered responses. You cannot undo this once confirmed."
      />
    </div>
  );
}
