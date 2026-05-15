import type { Poll } from "@/types/polls";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  BarChart3, 
  CheckCircle2,
  ArrowUpRight,
  LayoutGrid,
  List,
  History
} from "lucide-react";
import { useVotedPolls } from "@/hooks/use-polls";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { LoaderContainer } from "@/components/ui/loader";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";

export default function VotedPollsPage() {
  const { data: pollsResponse, isLoading: isPollsLoading, error: pollsError } = useVotedPolls();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");

  const polls = pollsResponse?.data || [];

  const filteredPolls = polls.filter((poll: Poll) => 
    poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poll.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isPollsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <LoaderContainer message="Fetching your activity..." />
      </div>
    );
  }

  if (pollsError) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="font-semibold text-lg text-foreground">Failed to load history</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-xs mx-auto">
            {(pollsError as Error).message || "There was an error connecting to the server."}
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <History className="size-6 text-primary" />
            Voting History
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Review the polls you've participated in.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
            <button
              onClick={() => setViewMode("cards")}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === "cards" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === "table" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search polls you've voted on..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
        />
      </div>

      {filteredPolls.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground mb-4">
            <History className="size-6" />
          </div>
          <h3 className="font-semibold">{searchQuery ? "No matching history" : "No votes yet"}</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {searchQuery ? "Try a different search." : "You haven't participated in any polls yet."}
          </p>
          {!searchQuery && (
            <Button asChild className="rounded-xl font-bold">
              <Link to="/explore">Explore Polls</Link>
            </Button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredPolls.map((poll: Poll) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={poll._id} 
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <BarChart3 className="size-5" />
                  </div>
                  <div>
                    <Link to={`/vote/${poll._id}/results`}>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {poll.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-black uppercase tracking-tight text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> Voted
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">• {poll.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/50 pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-black">Total Responses</p>
                  <p className="mt-0.5 text-lg font-black">{poll.responseCount || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-black">Participated</p>
                  <p className="mt-0.5 text-lg font-black text-primary">
                    {poll.createdAt ? formatDistanceToNow(new Date(poll.createdAt)) : "N/A"} ago
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end text-xs text-muted-foreground">
                <Link to={`/vote/${poll._id}/results`} className="inline-flex items-center gap-1 font-bold text-foreground hover:underline">
                  View Results <ArrowUpRight className="size-3.5" />
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Participants</TableHead>
                <TableHead className="text-right">Last Activity</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolls.map((p: Poll) => (
                <TableRow key={p._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
                        <BarChart3 className="size-4" />
                      </div>
                      <Link to={`/vote/${p._id}/results`} className="font-bold hover:text-primary">
                        {p.title}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground capitalize">{p.status}</span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-black">{p.responseCount || 0}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground font-medium">
                    {p.updatedAt ? formatDistanceToNow(new Date(p.updatedAt)) : "N/A"} ago
                  </TableCell>
                  <TableCell className="text-right">
                     <Link to={`/vote/${p._id}/results`} className="text-primary hover:underline font-black text-xs uppercase tracking-widest">
                       Results
                     </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
