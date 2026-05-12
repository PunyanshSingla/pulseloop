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
  List
} from "lucide-react";

const polls = [
  { id: "1", name: "Q3 product roadmap priorities", status: "Live", votes: 2410, rate: 92, updated: "2m ago", views: 4210, type: "Survey" },
  { id: "2", name: "Pricing tier preference", status: "Live", votes: 1890, rate: 88, updated: "14m ago", views: 3120, type: "Marketing" },
  { id: "3", name: "Onboarding flow A/B", status: "Live", votes: 1562, rate: 81, updated: "1h ago", views: 2840, type: "Product" },
  { id: "4", name: "New logo direction", status: "Draft", votes: 0, rate: 0, updated: "Yesterday", views: 120, type: "Design" },
  { id: "5", name: "Conference talk topics", status: "Closed", votes: 4012, rate: 95, updated: "3d ago", views: 5600, type: "Community" },
  { id: "6", name: "Weekly team pulse", status: "Live", votes: 45, rate: 100, updated: "5h ago", views: 45, type: "Internal" },
  { id: "7", name: "Holiday party location", status: "Closed", votes: 82, rate: 91, updated: "2w ago", views: 90, type: "Internal" },
  { id: "8", name: "Feature X feedback", status: "Draft", votes: 0, rate: 0, updated: "1w ago", views: 0, type: "Product" },
];

export default function PollsPage() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

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
                className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
              />
            </div>

            {/* Polls List */}
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {polls.map((poll) => (
                  <div key={poll.id} className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-lg bg-muted text-muted-foreground">
                          <BarChart3 className="size-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {poll.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StatusPill status={poll.status} />
                            <span className="text-xs text-muted-foreground">• {poll.type}</span>
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
                        <p className="mt-0.5 text-lg font-semibold">{poll.votes.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Completion</p>
                        <p className="mt-0.5 text-lg font-semibold">{poll.rate}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Views</p>
                        <p className="mt-0.5 text-lg font-semibold">{poll.views.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        Updated {poll.updated}
                      </span>
                      <Link to={`/polls/${poll.id}/results`} className="inline-flex items-center gap-1 font-medium text-foreground hover:underline">
                        View Results <ArrowUpRight className="size-3.5" />
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
                      {polls.map((p) => (
                        <tr key={p.id} className="border-b border-border/70 last:border-0 transition-colors hover:bg-muted/40">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="grid size-8 place-items-center rounded-md bg-muted text-muted-foreground">
                                <BarChart3 className="size-4" />
                              </div>
                              <p className="font-medium">{p.name}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusPill status={p.status} />
                          </td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.type}</td>
                          <td className="px-5 py-3.5 text-right tabular-nums">{p.votes.toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-right tabular-nums">{p.rate}%</td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.updated}</td>
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
