import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: number;
}

export const Loader = ({ className, size = 24 }: LoaderProps) => {
  return (
    <Loader2 
      className={cn("animate-spin text-primary", className)} 
      size={size} 
    />
  );
};

export const LoaderContainer = ({ 
  className, 
  children, 
  message 
}: { 
  className?: string; 
  children?: React.ReactNode;
  message?: string;
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <Loader size={32} className="relative z-10" />
      </div>
      {message && (
        <p className="mt-4 text-xs font-black text-muted-foreground uppercase tracking-[0.2em] animate-pulse">
          {message}
        </p>
      )}
      {children}
    </div>
  );
};
