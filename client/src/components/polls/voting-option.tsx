import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface VotingOptionProps {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export const VotingOption = ({
  id,
  text,
  isSelected,
  onSelect,
  disabled,
}: VotingOptionProps) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.015, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.985 } : {}}
      onClick={() => !disabled && onSelect(id)}
      disabled={disabled}
      className={cn(
        "relative w-full flex items-center justify-between p-7 rounded-[2rem] border-2 transition-all duration-500 text-left overflow-hidden group",
        isSelected
          ? "border-primary bg-primary/[0.03] shadow-[0_20px_40px_-12px_rgba(var(--primary-rgb),0.15)] ring-1 ring-primary/20"
          : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50",
        disabled && !isSelected && "opacity-60 grayscale cursor-not-allowed"
      )}
    >
      <div className="flex items-center gap-5 z-10">
        <div
          className={cn(
            "flex items-center justify-center size-7 rounded-2xl border-2 transition-all duration-500",
            isSelected
              ? "bg-primary border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]"
              : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 group-hover:border-primary/40"
          )}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
            >
              <Check className="size-4.5 text-white" strokeWidth={4} />
            </motion.div>
          )}
        </div>
        <span className={cn(
          "text-lg font-black tracking-tight transition-colors duration-500",
          isSelected ? "text-primary" : "text-slate-700 dark:text-slate-200"
        )}>
          {text}
        </span>
      </div>

      {/* Modern Gradient Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent transition-opacity duration-700",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      />
    </motion.button>
  );
};

