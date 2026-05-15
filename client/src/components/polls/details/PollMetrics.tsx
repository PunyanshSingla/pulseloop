import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Eye, Clock } from "lucide-react";

import type { Poll, Analytics } from "@/types/polls";

interface PollMetricsProps {
  analytics: Analytics;
  poll: Poll;
}

export const PollMetrics = ({ analytics, poll }: PollMetricsProps) => {
  const stats = [
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
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
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
  );
};
