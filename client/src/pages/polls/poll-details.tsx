import { authClient } from "@/lib/auth-client";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { usePoll, useUpdatePoll, useDeletePoll } from "@/hooks/use-polls";
import { 
  ArrowLeft, 
  BarChart3, 
  Clock, 
  Globe, 
  Lock, 
  MoreHorizontal, 
  Share2, 
  Trash2,
  CheckCircle2,
  Eye,
  Copy,
  Settings2,
  ExternalLink,
  Loader2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function PollDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: pollResponse, isLoading: isPollLoading } = usePoll(id!);
  const { mutate: updatePoll } = useUpdatePoll(id!);
  const { mutate: deletePoll } = useDeletePoll();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "responses" | "settings">("overview");

  if (isSessionPending || isPollLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const poll = pollResponse?.data;

  if (!session) {
    navigate("/sign-in");
    return null;
  }

  if (!poll) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar user={session.user} />
        <div className="flex flex-1 flex-col">
          <Topbar userName={session.user.name} />
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-semibold">Poll not found</h2>
            <Button onClick={() => navigate("/polls")}>Back to polls</Button>
          </div>
        </div>
      </div>
    );
  }

  const copyLink = () => {
    const url = `${import.meta.env.VITE_APP_ORIGIN}/p/${poll._id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const toggleStatus = () => {
    const nextStatus = poll.status === "active" ? "closed" : "active";
    updatePoll({ status: nextStatus });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this poll? This action cannot be undone.")) {
      deletePoll(poll._id, {
        onSuccess: () => navigate("/polls")
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar user={session.user} />
      
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userName={session.user.name} />
        
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="mx-auto max-w-5xl space-y-8">
            {/* Breadcrumbs / Back */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link to="/polls" className="hover:text-foreground transition-colors">Polls</Link>
              <span>/</span>
              <span className="text-foreground font-medium">{poll.title}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight">{poll.title}</h1>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    poll.status === "active" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {poll.status === "active" && <span className="size-1.5 animate-pulse rounded-full bg-primary" />}
                    {poll.status}
                  </span>
                </div>
                <p className="text-muted-foreground">{poll.description || "No description provided."}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={copyLink}>
                  <Share2 className="size-4" />
                  Share
                </Button>
                <Button size="sm" className="gap-2" asChild>
                  <a href={`${import.meta.env.VITE_APP_ORIGIN}/p/${poll._id}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                    Live Preview
                  </a>
                </Button>
                <button className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground">
                  <MoreHorizontal className="size-5" />
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Responses", value: poll.responseCount || 0, icon: BarChart3, color: "text-primary" },
                { label: "Completion Rate", value: poll.responseCount ? "100%" : "0%", icon: CheckCircle2, color: "text-emerald-500" },
                { label: "Avg. Time", value: "N/A", icon: Clock, color: "text-amber-500" },
                { label: "Total Views", value: "N/A", icon: Eye, color: "text-blue-500" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                    <stat.icon className={`size-4 ${stat.color} opacity-70`} />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex gap-8">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "responses", label: "Responses" },
                  { id: "settings", label: "Settings" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 text-sm font-medium transition-colors relative ${
                      activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  {/* Left Column: Questions Preview */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-6">Poll Questions</h3>
                      <div className="space-y-8">
                        {poll.questions.map((q: any, idx: number) => (
                          <div key={q._id} className="space-y-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">
                                {idx + 1}
                              </span>
                              <h4 className="font-medium">{q.text}</h4>
                            </div>
                            <div className="grid gap-2 ml-9">
                              {q.options.map((o: any) => (
                                <div key={o._id} className="group flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                                  <div className="flex flex-col">
                                    <span className="text-sm">{o.text}</span>
                                    <span className="text-[10px] text-muted-foreground">{o.responseCount || 0} votes</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground font-medium">
                                    {Math.round(o.percentage || 0)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Quick Info & Actions */}
                  <div className="space-y-6">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                      <h3 className="text-sm font-semibold mb-4">Quick Share</h3>
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2.5">
                        <code className="flex-1 text-xs text-muted-foreground truncate">
                          {import.meta.env.VITE_APP_ORIGIN.replace(/^https?:\/\//, "")}/p/{poll._id}
                        </code>
                        <button onClick={copyLink} className="p-2 hover:bg-muted rounded-md transition-colors">
                          <Copy className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                      <h3 className="text-sm font-semibold mb-4">Management</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start gap-2 h-10" onClick={toggleStatus}>
                          {poll.status === "active" ? <Lock className="size-4" /> : <Globe className="size-4" />}
                          {poll.status === "active" ? "Close Poll" : "Open Poll"}
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2 h-10 text-destructive hover:bg-destructive/10" onClick={handleDelete}>
                          <Trash2 className="size-4" />
                          Delete Poll
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "responses" && (
                <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
                  <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground mx-auto mb-4">
                    <BarChart3 className="size-6" />
                  </div>
                  <h3 className="font-semibold text-lg">Detailed Analytics Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                    We're building a powerful response viewer that will help you export data, filter by respondents, and visualize trends.
                  </p>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="max-w-2xl space-y-8">
                  <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Settings2 className="size-4 text-primary" />
                      Visibility & Security
                    </h3>
                    <div className="space-y-6 pt-4">
                      {[
                        { icon: Globe, label: "Public Access", desc: "Anyone with the link can view and vote.", active: poll.visibility === "public" },
                        { icon: Lock, label: "Require Login", desc: "Respondents must be signed in to vote.", active: !poll.allowAnonymous },
                        { icon: CheckCircle2, label: "One vote per user", desc: "Prevents multiple submissions from the same IP/account.", active: true },
                      ].map((s) => (
                        <div key={s.label} className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className="mt-0.5 grid size-8 place-items-center rounded-lg bg-muted">
                              <s.icon className="size-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{s.label}</p>
                              <p className="text-xs text-muted-foreground">{s.desc}</p>
                            </div>
                          </div>
                          <div className={`h-5 w-10 rounded-full p-0.5 transition-colors ${s.active ? "bg-primary" : "bg-muted"}`}>
                            <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${s.active ? "translate-x-5" : ""}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
