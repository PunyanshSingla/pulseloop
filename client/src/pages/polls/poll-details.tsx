import { authClient } from "@/lib/auth-client";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { usePoll, useUpdatePoll, useDeletePoll, usePollResponses } from "@/hooks/use-polls";
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
  ShieldCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Filter,
  RefreshCcw,
  Smartphone,
  Monitor,
  Languages,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function PollDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: pollResponse, isLoading: isPollLoading } = usePoll(id!);
  const { mutate: updatePoll } = useUpdatePoll(id!);
  const { mutate: deletePoll } = useDeletePoll();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "responses" | "settings">("overview");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { data: responsesData, isLoading: isResponsesLoading } = usePollResponses(id!);

  // Responses Tab State
  const [responseSearch, setResponseSearch] = useState("");
  const [selectedQuestionFilter, setSelectedQuestionFilter] = useState<string>("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    const url = `${import.meta.env.VITE_APP_ORIGIN}/vote/${poll._id}`;
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
          <div className="mx-auto space-y-8">
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
                  <a href={`${import.meta.env.VITE_APP_ORIGIN}/vote/${poll._id}`} target="_blank" rel="noopener noreferrer">
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
                { 
                  label: "Completion Rate", 
                  value: poll.viewCount > 0 
                    ? `${Math.min(100, Math.round((poll.responseCount / poll.viewCount) * 100))}%` 
                    : "0%", 
                  icon: CheckCircle2, 
                  color: "text-emerald-500" 
                },
                { label: "Avg. Time", value: `${poll.avgTimeTaken || 0}s`, icon: Clock, color: "text-amber-500" },
                { label: "Total Views", value: poll.viewCount || 0, icon: Eye, color: "text-blue-500" },
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
                  { id: "audience", label: "Audience" },
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
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Poll Questions</h3>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="size-8"
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                          >
                            <ChevronLeft className="size-4" />
                          </Button>
                          <span className="text-xs font-medium text-muted-foreground w-12 text-center">
                            {currentQuestionIndex + 1} / {poll.questions.length}
                          </span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="size-8"
                            disabled={currentQuestionIndex === poll.questions.length - 1}
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                          >
                            <ChevronRight className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {poll.questions.map((q: any, idx: number) => (
                          idx === currentQuestionIndex && (
                            <motion.div 
                              key={q._id} 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="space-y-4"
                            >
                              <div className="flex items-center gap-3">
                                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">
                                  {idx + 1}
                                </span>
                                <h4 className="font-medium">{q.text}</h4>
                              </div>
                              <div className="grid gap-2 ml-9">
                                {q.options.map((o: any) => (
                                  <div key={o._id} className="group flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{o.text}</span>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="h-1.5 w-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                          <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${o.percentage || 0}%` }}
                                            className="h-full bg-primary"
                                          />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{o.responseCount || 0} votes</span>
                                      </div>
                                    </div>
                                    <span className="text-xs font-bold text-primary">
                                      {Math.round(o.percentage || 0)}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )
                        ))}
                      </div>

                      {/* Question Navigation Dots */}
                      <div className="mt-8 flex justify-center gap-1.5">
                        {poll.questions.map((_: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              idx === currentQuestionIndex ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/30"
                            }`}
                          />
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
                          {import.meta.env.VITE_APP_ORIGIN.replace(/^https?:\/\//, "")}/vote/{poll._id}
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
                <div className="space-y-6">
                  {/* Filters Bar */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-card border border-border rounded-xl shadow-sm">
                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                          placeholder="Search respondents..."
                          value={responseSearch}
                          onChange={(e) => {
                            setResponseSearch(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                      <select 
                        value={selectedQuestionFilter}
                        onChange={(e) => {
                          setSelectedQuestionFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/10"
                      >
                        <option value="all">All Questions</option>
                        {poll.questions.map((q: any) => (
                          <option key={q._id} value={q._id}>{q.text}</option>
                        ))}
                      </select>
                      <select 
                        value={selectedTypeFilter}
                        onChange={(e) => {
                          setSelectedTypeFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/10"
                      >
                        <option value="all">All Types</option>
                        <option value="authenticated">Authenticated</option>
                        <option value="anonymous">Anonymous</option>
                      </select>
                    </div>
                    { (responseSearch || selectedQuestionFilter !== "all" || selectedTypeFilter !== "all") && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setResponseSearch("");
                          setSelectedQuestionFilter("all");
                          setSelectedTypeFilter("all");
                          setCurrentPage(1);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Individual Submissions</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left text-xs text-muted-foreground bg-muted/5">
                            <th className="px-6 py-4 font-medium uppercase tracking-wider">Respondent</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider">Question</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider">Answer</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Time Taken</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {isResponsesLoading ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center">
                                <Loader2 className="size-6 animate-spin mx-auto text-primary opacity-50" />
                              </td>
                            </tr>
                          ) : (() => {
                            const filtered = (responsesData?.data || []).filter((resp: any) => {
                              const matchesSearch = !responseSearch || 
                                resp.respondentId?.name?.toLowerCase().includes(responseSearch.toLowerCase()) ||
                                resp.respondentId?.email?.toLowerCase().includes(responseSearch.toLowerCase()) ||
                                (responseSearch.toLowerCase() === "anonymous" && !resp.respondentId);
                              
                              const matchesQuestion = selectedQuestionFilter === "all" || resp.questionId === selectedQuestionFilter;
                              
                              const matchesType = selectedTypeFilter === "all" || 
                                (selectedTypeFilter === "authenticated" && !!resp.respondentId) ||
                                (selectedTypeFilter === "anonymous" && !resp.respondentId);
                              
                              return matchesSearch && matchesQuestion && matchesType;
                            });

                            const totalFiltered = filtered.length;
                            const totalPages = Math.ceil(totalFiltered / itemsPerPage);
                            const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                            if (totalFiltered === 0) {
                              return (
                                <tr>
                                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                    No responses match your filters.
                                  </td>
                                </tr>
                              );
                            }

                            return (
                              <>
                                {paginated.map((resp: any) => (
                                  <tr key={resp._id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                      <div className="flex flex-col">
                                        <span className="font-medium text-foreground">
                                          {resp.respondentId?.name || "Anonymous User"}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                          {resp.respondentId?.email || "No email available"}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-[200px] truncate font-medium text-slate-500 dark:text-slate-400">
                                      {resp.questionText}
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary border border-primary/20">
                                        {resp.optionText}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-right tabular-nums text-muted-foreground">
                                      {resp.timeTaken}s
                                    </td>
                                    <td className="px-6 py-4 text-right tabular-nums text-muted-foreground">
                                      {formatDistanceToNow(new Date(resp.createdAt))} ago
                                    </td>
                                  </tr>
                                ))}
                                
                                {/* Pagination Footer */}
                                {totalPages > 1 && (
                                  <tr>
                                    <td colSpan={5} className="px-6 py-4 bg-muted/5">
                                      <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">
                                          Showing <span className="font-medium text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, totalFiltered)}</span> of <span className="font-medium text-foreground">{totalFiltered}</span> results
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <Button 
                                            variant="outline" 
                                            size="icon" 
                                            className="size-8"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                          >
                                            <ChevronLeft className="size-4" />
                                          </Button>
                                          <span className="text-xs font-medium px-2">
                                            {currentPage} / {totalPages}
                                          </span>
                                          <Button 
                                            variant="outline" 
                                            size="icon" 
                                            className="size-8"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                          >
                                            <ChevronRight className="size-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

               {activeTab === "audience" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">Participant Profiles</h3>
                      <p className="text-sm text-muted-foreground mt-1">Detailed technical and network identities for all respondents</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCcw className="size-3.5" />
                        Refresh Data
                      </Button>
                    </div>
                  </div>

                  {isResponsesLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border">
                      <Loader2 className="size-8 animate-spin text-primary opacity-50 mb-4" />
                      <p className="text-sm font-medium text-muted-foreground">Analyzing audience data...</p>
                    </div>
                  ) : (responsesData?.data || []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border text-center px-6">
                      <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Smartphone className="size-6 text-muted-foreground" />
                      </div>
                      <h4 className="text-lg font-semibold mb-1">No Audience Profiles Yet</h4>
                      <p className="text-sm text-muted-foreground max-w-xs">Technical data will appear here as soon as participants start voting.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {(responsesData?.data || []).map((resp: any) => (
                        <div key={resp._id} className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                          {/* Header: Identity */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {resp.respondentId?.name?.[0] || "?"}
                              </div>
                              <div>
                                <h4 className="font-bold text-foreground leading-none">{resp.respondentId?.name || "Anonymous User"}</h4>
                                <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1.5 uppercase font-semibold tracking-wider">
                                  {resp.isAnonymous ? (
                                    <span className="px-1.5 py-0.5 rounded bg-muted">Guest Voter</span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">Registered</span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                <ShieldCheck className="size-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                              </div>
                            </div>
                          </div>

                          {/* Grid Details */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Network Identity</p>
                              <div className="flex items-center gap-2">
                                <Globe className="size-3 text-blue-500" />
                                <span className="text-xs font-mono font-medium">{resp.ipAddress}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Display Specs</p>
                              <div className="flex items-center gap-2">
                                <Monitor className="size-3 text-purple-500" />
                                <span className="text-xs font-medium">{resp.deviceInfo?.screenResolution || "Unknown"}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Environment</p>
                              <div className="flex items-center gap-2">
                                <Settings2 className="size-3 text-amber-500" />
                                <span className="text-xs font-medium">{resp.deviceInfo?.os} • {resp.deviceInfo?.browser}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Language</p>
                              <div className="flex items-center gap-2">
                                <Languages className="size-3 text-emerald-500" />
                                <span className="text-xs font-medium uppercase">{resp.deviceInfo?.language || "N/A"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Advanced Specs: User Agent */}
                          <div className="space-y-2 mb-6">
                            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">System Signature (User Agent)</p>
                            <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-[10px] font-mono leading-relaxed text-muted-foreground break-all line-clamp-2 group-hover:line-clamp-none transition-all">
                              {resp.deviceInfo?.userAgent}
                            </div>
                          </div>

                          {/* Security Infrastructure */}
                          <div className="space-y-3 pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-muted-foreground font-medium uppercase">Voter ID</span>
                              <span className="font-mono text-foreground font-bold">{resp.voterId?.slice(0, 16)}...</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-muted-foreground font-medium uppercase">Fingerprint</span>
                              <span className="font-mono text-foreground font-bold truncate max-w-[150px]">{resp.fingerprint}</span>
                            </div>
                          </div>

                          {/* Footer: Date */}
                          <div className="mt-6 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <Clock className="size-3" />
                              <span>Joined {formatDistanceToNow(new Date(resp.createdAt))} ago</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] gap-1 hover:bg-primary/5 hover:text-primary">
                              Audit Profile
                              <ExternalLink className="size-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                        { 
                          id: "visibility",
                          icon: Globe, 
                          label: "Public Access", 
                          desc: "Anyone with the link can view and vote.", 
                          active: poll.visibility === "public",
                          onToggle: () => updatePoll({ visibility: poll.visibility === "public" ? "private" : "public" })
                        },
                        { 
                          id: "allowAnonymous",
                          icon: Lock, 
                          label: "Allow Guest Voting", 
                          desc: "Respondents don't need to be signed in to vote.", 
                          active: poll.allowAnonymous,
                          onToggle: () => updatePoll({ allowAnonymous: !poll.allowAnonymous })
                        },
                        { 
                          id: "allowMultipleSubmissions",
                          icon: CheckCircle2, 
                          label: "Allow Multiple Submissions", 
                          desc: "Participants can vote more than once on this poll.", 
                          active: poll.allowMultipleSubmissions,
                          onToggle: () => updatePoll({ allowMultipleSubmissions: !poll.allowMultipleSubmissions })
                        },
                      ].map((s) => (
                        <div key={s.id} className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className="mt-0.5 grid size-8 place-items-center rounded-lg bg-muted">
                              <s.icon className="size-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{s.label}</p>
                              <p className="text-xs text-muted-foreground">{s.desc}</p>
                            </div>
                          </div>
                          <button 
                            onClick={s.onToggle}
                            className={`h-5 w-10 rounded-full p-0.5 transition-colors ${s.active ? "bg-primary" : "bg-muted"}`}
                          >
                            <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${s.active ? "translate-x-5" : ""}`} />
                          </button>
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
