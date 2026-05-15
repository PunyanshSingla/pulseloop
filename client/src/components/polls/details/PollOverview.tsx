import { motion, AnimatePresence } from "framer-motion";
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
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { PollMetrics } from "./PollMetrics";

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

interface PollOverviewProps {
  poll: any;
  analytics: any;
}

export const PollOverview = ({ poll, analytics }: PollOverviewProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <PollMetrics analytics={analytics} poll={poll} />

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
                                {q.options.map((index: number) => (
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
                    {analytics?.demographics.devices.map((index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip label="" suffix="users" />} />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="circle" 
                    wrapperStyle={{ 
                      fontSize: '10px', 
                      color: 'hsl(var(--muted-foreground))',
                      paddingTop: '20px'
                    }} 
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
                  {analytics?.demographics.browsers.map((index: number) => (
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
                  {analytics?.demographics.countries?.map((index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
