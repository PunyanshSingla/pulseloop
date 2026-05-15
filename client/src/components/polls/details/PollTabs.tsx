import { motion } from "framer-motion";

interface PollTabsProps {
  activeTab: "overview" | "responses" | "settings";
  onTabChange: (tab: "overview" | "responses" | "settings") => void;
}

export const PollTabs = ({ activeTab, onTabChange }: PollTabsProps) => {
  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "responses" as const, label: "Responses" },
    { id: "settings" as const, label: "Settings" },
  ];

  return (
    <div className="border-b border-border/50">
      <div className="flex gap-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
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
  );
};
