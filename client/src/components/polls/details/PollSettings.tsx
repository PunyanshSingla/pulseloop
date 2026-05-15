import { motion } from "framer-motion";
import { Settings2, Globe, Lock, CheckCircle2 } from "lucide-react";

interface PollSettingsProps {
  poll: any;
  onUpdatePoll: (data: any) => void;
}

export const PollSettings = ({ poll, onUpdatePoll }: PollSettingsProps) => {
  const settings = [
    { 
      id: "visibility",
      icon: Globe, 
      label: "Public Access", 
      desc: "Anyone with the link can view and vote.", 
      active: poll.visibility === "public",
      onToggle: () => onUpdatePoll({ visibility: poll.visibility === "public" ? "private" : "public" })
    },
    { 
      id: "allowAnonymous",
      icon: Lock, 
      label: "Allow Guest Voting", 
      desc: "Respondents don't need to be signed in to vote.", 
      active: poll.allowAnonymous,
      onToggle: () => onUpdatePoll({ allowAnonymous: !poll.allowAnonymous })
    },
    { 
      id: "allowMultipleSubmissions",
      icon: CheckCircle2, 
      label: "Allow Multiple Submissions", 
      desc: "Participants can vote more than once on this poll.", 
      active: poll.allowMultipleSubmissions,
      onToggle: () => onUpdatePoll({ allowMultipleSubmissions: !poll.allowMultipleSubmissions })
    },
  ];

  return (
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
          {settings.map((s) => (
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
  );
};
