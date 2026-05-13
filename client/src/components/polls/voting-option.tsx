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
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={() => !disabled && onSelect(id)}
      disabled={disabled}
      className={cn(
        "relative w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden group",
        isSelected
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-1 ring-primary/20"
          : "border-muted bg-white/50 dark:bg-slate-900/50 hover:border-primary/40 hover:bg-white dark:hover:bg-slate-900 shadow-sm",
        disabled && !isSelected && "opacity-60 grayscale cursor-not-allowed"
      )}
    >
      <div className="flex items-center gap-4 z-10">
        <div
          className={cn(
            "flex items-center justify-center size-6 rounded-full border-2 transition-colors duration-300",
            isSelected
              ? "bg-primary border-primary"
              : "border-muted-foreground/30 group-hover:border-primary/50"
          )}
        >
          {isSelected && <Check className="size-4 text-primary-foreground" strokeWidth={3} />}
        </div>
        <span className={cn(
          "text-lg font-medium transition-colors duration-300",
          isSelected ? "text-primary" : "text-foreground"
        )}>
          {text}
        </span>
      </div>

      {/* Decorative background element */}
      <div 
        className={cn(
          "absolute right-[-10%] top-[-10%] size-24 rounded-full blur-3xl transition-opacity duration-500",
          isSelected ? "bg-primary/20 opacity-100" : "bg-primary/5 opacity-0 group-hover:opacity-100"
        )}
      />
    </motion.button>
  );
};
