import { useParams, Link } from "react-router-dom";
import { usePoll, usePollAnalytics } from "@/hooks/use-polls";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, BarChart3, Users, Share2, Globe, CheckCircle2, Clock, Smartphone, Monitor } from "lucide-react";
import { LoaderContainer } from "@/components/ui/loader";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { toast } from "sonner";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import type { Poll, Analytics } from "@/types/polls";

export default function PollResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading: isPollLoading, refetch, isRefetching } = usePoll(id!);
  const { data: analyticsResponse, isLoading: isAnalyticsLoading } = usePollAnalytics(id!);

  const poll = response?.data as Poll;
  const analytics = analyticsResponse as unknown as Analytics;

  if (isPollLoading || isAnalyticsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <LoaderContainer message="Aggregating Deep Insights..." />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Poll Not Found</h2>
          <p className="text-muted-foreground">The results you are looking for don't exist or have been removed.</p>
          <Button asChild variant="outline" className="mt-4 rounded-2xl h-12 px-8">
            <Link to="/explore">Explore Other Polls</Link>
          </Button>
        </div>
      </div>
    );
  }

  const copyResultsLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Results link copied!");
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground selection:bg-primary/20 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03),transparent_40%)] pointer-events-none" />
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/explore" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <Logo className="scale-75" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isRefetching} className="rounded-xl h-10 w-10 p-0">
            <RefreshCw className={`size-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={copyResultsLink} className="rounded-xl h-10 gap-2 border-slate-200 dark:border-slate-800 font-bold">
            <Share2 className="size-4" />
            <span className="hidden sm:inline">Share Results</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 relative z-10">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="space-y-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
              <CheckCircle2 className="size-3" />
              Final Results Published
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {poll.title}
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-3xl leading-relaxed">
                {poll.description || "The results are in! Explore the deep insights and community participation patterns below."}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <Users className="size-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Voters</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{poll.responseCount || 0}</div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <BarChart3 className="size-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Questions</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{poll.questions?.length || 0}</div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <Globe className="size-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reach</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{poll.viewCount || 0}</div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <Clock className="size-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg. Time</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{poll.avgTimeTaken || 0}s</div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800" />

          {/* New Data Row: Participation Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Submission Timeline</h3>
                  <p className="text-xs text-muted-foreground mt-1">Activity over the last 7 days</p>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.timeline || []}>
                    <defs>
                      <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="votes" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorVotes)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <div className="mb-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Audience Identity</h3>
                <p className="text-xs text-muted-foreground mt-1">Registered vs. Guest</p>
              </div>
              <div className="h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Logged In', value: analytics?.poll.loggedInResponses || 0 },
                        { name: 'Guest Users', value: analytics?.poll.anonymousResponses || 0 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      <Cell fill="#6366f1" />
                      <Cell fill="#94a3b8" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black">{poll.responseCount}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
                </div>
              </div>
              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#6366f1]" />
                    <span className="text-slate-500">Registered</span>
                  </div>
                  <span>{analytics?.poll.loggedInResponses || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-slate-300" />
                    <span className="text-slate-500">Anonymous</span>
                  </div>
                  <span>{analytics?.poll.anonymousResponses || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800" />

          {/* Demographic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Smartphone className="size-3 text-primary" />
                  Top Devices
                </h4>
                <div className="space-y-4">
                  {analytics?.demographics.devices.slice(0, 4).map((d) => (
                    <div key={d.name} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                        <span>{Math.round((d.value / (poll.responseCount || 1)) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(d.value / (poll.responseCount || 1)) * 100}%` }}
                          viewport={{ once: true }}
                          className="h-full bg-primary" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Monitor className="size-3 text-primary" />
                  Top OS
                </h4>
                <div className="space-y-4">
                  {analytics?.demographics.os.slice(0, 4).map((o) => (
                    <div key={o.name} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600 dark:text-slate-300">{o.name}</span>
                        <span>{Math.round((o.value / (poll.responseCount || 1)) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(o.value / (poll.responseCount || 1)) * 100}%` }}
                          viewport={{ once: true }}
                          className="h-full bg-indigo-400" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Globe className="size-3 text-primary" />
                  Top Locations
                </h4>
                <div className="space-y-4">
                  {analytics?.demographics.countries.slice(0, 4).map((c) => (
                    <div key={c.name} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600 dark:text-slate-300">{c.name}</span>
                        <span>{Math.round((c.value / (poll.responseCount || 1)) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(c.value / (poll.responseCount || 1)) * 100}%` }}
                          viewport={{ once: true }}
                          className="h-full bg-emerald-400" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800" />

          {/* Questions & Results (Original section) */}
          <div className="space-y-16">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Question Summaries</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Granular breakdown of every response option.</p>
            </div>
            {poll.questions.map((q, idx) => {
              const totalVotesForQuestion = q.options.reduce((acc: number, o: { responseCount?: number }) => acc + (o.responseCount || 0), 0);
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={q._id} 
                  className="space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/70">Question {idx + 1}</span>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{q.text}</h3>
                    </div>
                    <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      {totalVotesForQuestion} responses
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {q.options.map((o) => {
                      const votes = o.responseCount || 0;
                      const percentage = Math.round(o.percentage || 0);
                      
                      return (
                        <div key={o._id} className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{o.text}</span>
                            <span className="font-black text-slate-900 dark:text-white">
                              {votes} <span className="text-slate-400 dark:text-slate-500 font-bold ml-1">({percentage}%)</span>
                            </span>
                          </div>
                          <div className="h-4 w-full bg-slate-200/50 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 relative">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                              className="h-full bg-primary relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                            </motion.div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Branding */}
          <div className="pt-20 pb-12 flex flex-col items-center gap-6 text-center">
            <div className="h-px w-24 bg-slate-200 dark:bg-slate-800" />
            <p className="text-sm font-medium text-slate-500 max-w-xs">
              Powered by PulseLoop — The modern engine for community feedback and real-time insights.
            </p>
            <Logo className="scale-75 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
          </div>
        </div>
      </main>
    </div>
  );
}
