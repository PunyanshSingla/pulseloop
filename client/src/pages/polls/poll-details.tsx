import { authClient } from "@/lib/auth-client";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { 
  BarChart3, 
  Clock, 
  Globe, 
  Lock, 
  MoreHorizontal, 
  Share2, 
  CheckCircle2,
  Eye,
  Settings2,
  ExternalLink,
  ShieldCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCcw,
  Smartphone,
  Monitor,
  Languages,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid, 
  AreaChart,
  Area,
  Legend
} from "recharts";
import { usePoll, useUpdatePoll, useDeletePoll, usePollResponses, usePollAnalytics, usePublishResults } from "@/hooks/use-polls";

const COLORS = ["#10b981", "#14b8a6", "#f59e0b", "#f97316", "#f43f5e", "#84cc16", "#0f766e"];

const CustomTooltip = ({ active, payload, label, suffix = "votes" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card/95 p-3 shadow-2xl backdrop-blur-md ring-1 ring-black/5">
        {label && <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>}
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ backgroundColor: payload[0].color || payload[0].fill }} />
          <p className="text-sm font-bold text-foreground">
            {payload[0].value} <span className="text-[10px] font-medium text-muted-foreground ml-0.5">{suffix}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};


export default function PollDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: pollResponse, isLoading: isPollLoading } = usePoll(id!);
  const { mutate: updatePoll } = useUpdatePoll(id!);
  const { mutate: deletePoll } = useDeletePoll();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "responses" | "audience" | "settings">("overview");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { data: responsesData, isLoading: isResponsesLoading } = usePollResponses(id!);
  const { data: analyticsResponse, isLoading: isAnalyticsLoading } = usePollAnalytics(id!);
  const { mutate: publishResults, isPending: isPublishing } = usePublishResults(id!);
  
  if (!isAnalyticsLoading) {
    console.log(analyticsResponse, "response from poll details page");
  }
  const analytics = analyticsResponse?.data;

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
      <div className="flex min-h-screen bg-background text-foreground">
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
      deletePoll(id!, {
        onSuccess: () => navigate("/polls")
      });
    }
  };

  const handlePublish = () => {
    if (confirm("Are you sure you want to publish the results? This will close the poll and make results public.")) {
      publishResults();
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Sidebar user={session.user} />
      
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userName={session.user.name} />
        
        <main className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto">
          <div className="mx-auto space-y-8 max-w-7xl">
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
                    poll.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                  }`}>
                    {poll.status === "active" && <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />}
                    {poll.status}
                  </span>
                </div>
                <p className="text-muted-foreground max-w-2xl">{poll.description || "No description provided."}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={copyLink}>
                  <Share2 className="size-4" />
                  Share
                </Button>
                <Button size="sm" className="gap-2 rounded-xl" asChild>
                  <a href={`${import.meta.env.VITE_APP_ORIGIN}/vote/${poll._id}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                    Live Preview
                  </a>
                </Button>
                {!poll.resultsPublished ? (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-2 rounded-xl border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500" 
                    onClick={handlePublish}
                    disabled={isPublishing}
                  >
                    <Globe className="size-4" />
                    Publish Results
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-bold text-emerald-500">
                    <ShieldCheck className="size-4" />
                    Results Published
                  </div>
                )}
                <button className="grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground">
                  <MoreHorizontal className="size-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border/50">
              <div className="flex gap-8 overflow-x-auto scrollbar-hide">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "responses", label: "Responses" },
                  { id: "audience", label: "Audience" },
                  { id: "settings", label: "Settings" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" 
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px] mt-8 pb-12">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        {
                          label: "Total Responses",
                          value: analytics?.poll.responseCount || poll.responseCount || 0,
                          sub: "Total votes cast",
                          icon: BarChart3,
                          color: "text-foreground",
                          bg: "bg-muted/50",
                        },
                        {
                          label: "Completion Rate",
                          value: `${analytics?.poll.completionRate.toFixed(1) || 0}%`,
                          sub: "Of unique visitors",
                          icon: CheckCircle2,
                          color: "text-emerald-500",
                          bg: "bg-emerald-500/10",
                        },
                        {
                          label: "Unique Visitors",
                          value: analytics?.poll.viewCount || poll.viewCount || 0,
                          sub: "Total unique reach",
                          icon: Eye,
                          color: "text-teal-500",
                          bg: "bg-teal-500/10",
                        },
                        {
                          label: "Avg. Engagement",
                          value: `${poll.avgTimeTaken || 0}s`,
                          sub: "Average time taken",
                          icon: Clock,
                          color: "text-amber-500",
                          bg: "bg-amber-500/10",
                        },
                      ].map((stat, i) => (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                          key={stat.label}
                          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-border"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                            <div className={`p-2 rounded-xl ${stat.bg} transition-transform duration-300 group-hover:scale-110`}>
                              <stat.icon className={`size-4 ${stat.color}`} />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.sub}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                      {/* Left Column: Results and Timeline */}
                      <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h3 className="text-lg font-bold">Voting Trend</h3>
                              <p className="text-xs text-muted-foreground mt-1">Daily response volume over the last 7 days</p>
                            </div>
                          </div>
                          <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={analytics?.timeline || []}>
                                <defs>
                                  <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis 
                                  dataKey="date" 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                                  dy={10}
                                />
                                <YAxis 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                                  dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                  type="monotone" 
                                  dataKey="votes" 
                                  stroke="#10b981" 
                                  strokeWidth={3}
                                  fillOpacity={1} 
                                  fill="url(#colorVotes)" 
                                  activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Question-wise Results */}
                        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm relative overflow-hidden">
                          <div className="flex items-center justify-between mb-8">
                            <div>
                              <h3 className="text-lg font-bold">Results Breakdown</h3>
                              <p className="text-xs text-muted-foreground mt-1">Visual distribution of answers per question</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="size-8 rounded-xl bg-muted/50"
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                              >
                                <ChevronLeft className="size-4" />
                              </Button>
                              <span className="text-[10px] font-bold text-muted-foreground w-12 text-center">
                                {currentQuestionIndex + 1} / {poll.questions.length}
                              </span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="size-8 rounded-xl bg-muted/50"
                                disabled={currentQuestionIndex === poll.questions.length - 1}
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                              >
                                <ChevronRight className="size-4" />
                              </Button>
                            </div>
                          </div>

                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentQuestionIndex}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              {analytics?.results.map((q: any, idx: number) => (
                                idx === currentQuestionIndex && (
                                  <div key={q.id} className="space-y-10">
                                    <div className="flex items-start gap-4">
                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground text-xs font-bold text-background">
                                        {idx + 1}
                                      </div>
                                      <div>
                                        <h4 className="text-base font-bold text-foreground leading-snug">{q.text}</h4>
                                        <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-widest font-semibold">{q.totalVotes} total responses</p>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                      <div className="space-y-5">
                                        {q.options.map((o: any, oIdx: number) => (
                                          <div key={o.id} className="group space-y-2.5">
                                            <div className="flex items-center justify-between text-xs">
                                              <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">{o.text}</span>
                                              <span className="font-bold text-foreground">{Math.round(o.percentage)}%</span>
                                            </div>
                                            <div className="h-2.5 w-full rounded-full bg-muted/50 overflow-hidden shadow-inner">
                                              <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${o.percentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: COLORS[oIdx % COLORS.length] }}
                                              />
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="h-[220px] flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                            <Pie
                                              data={q.options}
                                              innerRadius={55}
                                              outerRadius={80}
                                              paddingAngle={6}
                                              dataKey="count"
                                              nameKey="text"
                                              animationBegin={0}
                                              animationDuration={1500}
                                              stroke="none"
                                            >
                                              {q.options.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                              ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip label="" suffix="votes" />} />
                                          </PieChart>
                                        </ResponsiveContainer>
                                      </div>
                                    </div>
                                  </div>
                                )
                              ))}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Right Column: Demographics */}
                      <div className="space-y-8">
                        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                          <div className="mb-6">
                            <h3 className="text-sm font-bold">Device Distribution</h3>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Where your audience is voting from</p>
                          </div>
                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={analytics?.demographics.devices || []}
                                  innerRadius={45}
                                  outerRadius={75}
                                  dataKey="value"
                                  nameKey="name"
                                  stroke="none"
                                  paddingAngle={4}
                                >
                                  {analytics?.demographics.devices.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip label="" suffix="users" />} />
                                <Legend 
                                  verticalAlign="bottom" 
                                  height={36} 
                                  iconType="circle" 
                                  wrapperStyle={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }} 
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                          <div className="mb-6">
                            <h3 className="text-sm font-bold">Operating Systems</h3>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Top OS utilized by participants</p>
                          </div>
                          <div className="space-y-4">
                            {analytics?.demographics.os.slice(0, 5).map((os: any, idx: number) => (
                              <div key={os.name} className="flex items-center gap-3">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center justify-between text-[10px] font-medium">
                                    <span>{os.name}</span>
                                    <span className="text-muted-foreground">{os.value} users</span>
                                  </div>
                                  <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(os.value / (analytics.poll.responseCount || 1)) * 100}%` }}
                                      transition={{ duration: 1, ease: "easeOut" }}
                                      className="h-full rounded-full" 
                                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* New Detailed Analytics Row */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                      <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Submission Timeline Breakdown</h3>
                            <p className="text-xs text-muted-foreground mt-1">Comparing logged-in vs anonymous activity</p>
                          </div>
                        </div>
                        <div className="h-[250px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.timeline || []}>
                              <defs>
                                <linearGradient id="colorLoggedIn" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorAnonymous" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                              <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                                dy={10}
                              />
                              <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                                dx={-10}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Area 
                                type="monotone" 
                                dataKey="loggedIn" 
                                name="Logged-in"
                                stroke="#10b981" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorLoggedIn)" 
                                activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
                                stackId="1"
                              />
                              <Area 
                                type="monotone" 
                                dataKey="anonymous" 
                                name="Anonymous"
                                stroke="#10b981" 
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                fillOpacity={1} 
                                fill="url(#colorAnonymous)" 
                                activeDot={{ r: 4, strokeWidth: 0, fill: "#10b981" }}
                                stackId="1"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                        <div className="mb-6">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Audience Type</h3>
                          <p className="text-xs text-muted-foreground mt-1">Identity distribution</p>
                        </div>
                        <div className="h-[200px] relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "Logged-in", value: analytics?.poll.loggedInResponses || 0 },
                                  { name: "Anonymous", value: analytics?.poll.anonymousResponses || 0 }
                                ]}
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                              >
                                <Cell fill={COLORS[0]} />
                                <Cell fill="var(--muted)" />
                              </Pie>
                              <Tooltip content={<CustomTooltip label="" suffix="users" />} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-xl font-bold">{analytics?.poll.responseCount || 0}</p>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase">Votes</p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[0] }} />
                              <span className="text-muted-foreground">Logged-in</span>
                            </div>
                            <span className="font-bold">{analytics?.poll.loggedInResponses || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <div className="size-2 rounded-full bg-muted" />
                              <span className="text-muted-foreground">Anonymous</span>
                            </div>
                            <span className="font-bold">{analytics?.poll.anonymousResponses || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                        <div className="mb-6">
                          <h3 className="text-sm font-bold">Top Browsers</h3>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Most common browser platforms</p>
                        </div>
                        <div className="h-[180px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics?.demographics.browsers || []} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--foreground)" }} width={100} />
                              <Tooltip content={<CustomTooltip label="" suffix="users" />} cursor={{ fill: 'transparent' }} />
                              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12}>
                                {analytics?.demographics.browsers.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                        <div className="mb-6">
                          <h3 className="text-sm font-bold">Top Locations</h3>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Where your respondents are located</p>
                        </div>
                        <div className="h-[180px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics?.demographics.countries?.map((c: any) => ({
                              name: c.name,
                              value: c.value
                            })) || []} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--foreground)" }} width={100} />
                              <Tooltip content={<CustomTooltip label="" suffix="users" />} cursor={{ fill: 'transparent' }} />
                              <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={12}>
                                {analytics?.demographics.countries?.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "responses" && (
                  <motion.div
                    key="responses"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Filters Bar */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-card border border-border/50 rounded-2xl shadow-sm">
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
                            className="h-10 w-full rounded-xl border border-border/50 bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          />
                        </div>
                        <select 
                          value={selectedQuestionFilter}
                          onChange={(e) => {
                            setSelectedQuestionFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="h-10 px-3 rounded-xl border border-border/50 bg-background text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
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
                          className="h-10 px-3 rounded-xl border border-border/50 bg-background text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
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
                          className="text-xs text-muted-foreground hover:text-foreground rounded-xl"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>

                    <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-border/50 bg-muted/10 flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Individual Submissions</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border/50 text-left text-xs text-muted-foreground bg-muted/5">
                              <th className="px-6 py-4 font-medium uppercase tracking-wider">Respondent</th>
                              <th className="px-6 py-4 font-medium uppercase tracking-wider">Question</th>
                              <th className="px-6 py-4 font-medium uppercase tracking-wider">Answer</th>
                              <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Time Taken</th>
                              <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Submitted</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/20">
                            {isResponsesLoading ? (
                              <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                  <Loader2 className="size-6 animate-spin mx-auto text-muted-foreground opacity-50" />
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
                                      <td className="px-6 py-4 max-w-[200px] truncate font-medium text-muted-foreground">
                                        {resp.questionText}
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
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
                                              className="size-8 rounded-xl"
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
                                              className="size-8 rounded-xl"
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
                  </motion.div>
                )}

                {activeTab === "audience" && (
                  <motion.div
                    key="audience"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">Participant Profiles</h3>
                        <p className="text-sm text-muted-foreground mt-1">Detailed technical and network identities for all respondents</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                          <RefreshCcw className="size-3.5" />
                          Refresh Data
                        </Button>
                      </div>
                    </div>

                    {isResponsesLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border/50">
                        <Loader2 className="size-8 animate-spin text-muted-foreground opacity-50 mb-4" />
                        <p className="text-sm font-medium text-muted-foreground">Analyzing audience data...</p>
                      </div>
                    ) : (responsesData?.data || []).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border/50 text-center px-6">
                        <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Smartphone className="size-6 text-muted-foreground" />
                        </div>
                        <h4 className="text-lg font-semibold mb-1">No Audience Profiles Yet</h4>
                        <p className="text-sm text-muted-foreground max-w-xs">Technical data will appear here as soon as participants start voting.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {(responsesData?.data || []).map((resp: any) => (
                          <div key={resp._id} className="group relative rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-border">
                            {/* Header: Identity */}
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-muted flex items-center justify-center text-foreground font-bold">
                                  {resp.respondentId?.name?.[0] || "?"}
                                </div>
                                <div>
                                  <h4 className="font-bold text-foreground leading-none">{resp.respondentId?.name || "Anonymous User"}</h4>
                                  <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1.5 uppercase font-semibold tracking-wider">
                                    {resp.isAnonymous ? (
                                      <span className="px-1.5 py-0.5 rounded bg-muted/50">Guest Voter</span>
                                    ) : (
                                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">Registered</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
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
                                  <Globe className="size-3 text-teal-500" />
                                  <span className="text-xs font-mono font-medium">{resp.ipAddress}</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Display Specs</p>
                                <div className="flex items-center gap-2">
                                  <Monitor className="size-3 text-emerald-500" />
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
                                  <Languages className="size-3 text-orange-500" />
                                  <span className="text-xs font-medium uppercase">{resp.deviceInfo?.language || "N/A"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Advanced Specs: User Agent */}
                            <div className="space-y-2 mb-6">
                              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">System Signature (User Agent)</p>
                              <div className="p-3 rounded-xl bg-muted/30 border border-border/30 text-[10px] font-mono leading-relaxed text-muted-foreground break-all line-clamp-2 group-hover:line-clamp-none transition-all">
                                {resp.deviceInfo?.userAgent}
                              </div>
                            </div>

                            {/* Security Infrastructure */}
                            <div className="space-y-3 pt-4 border-t border-border/30">
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
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] gap-1 rounded-lg hover:bg-muted">
                                Audit Profile
                                <ExternalLink className="size-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-2xl space-y-8"
                  >
                    <div className="space-y-4 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                      <h3 className="flex items-center gap-2 font-semibold">
                        <Settings2 className="size-4 text-foreground" />
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
                            <div className="flex gap-4">
                              <div className="mt-0.5 grid size-10 place-items-center rounded-xl bg-muted/50 border border-border/50">
                                <s.icon className="size-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{s.label}</p>
                                <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                              </div>
                            </div>
                            <button 
                              onClick={s.onToggle}
                              className={`h-6 w-11 rounded-full p-0.5 transition-colors ${s.active ? "bg-foreground" : "bg-muted border border-border/50"}`}
                            >
                              <div className={`h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${s.active ? "translate-x-5" : ""}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
