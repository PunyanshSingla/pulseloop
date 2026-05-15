import { Link } from 'react-router-dom';

export function Logo({ className = "", iconOnly = false, noLink = false }: { className?: string, iconOnly?: boolean, noLink?: boolean }) {
  const content = (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
        {/* Icon Container */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          {/* Glow behind the icon */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-500 opacity-0 group-hover:opacity-100" />

          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_4px_12px_rgba(var(--primary),0.3)]"
          >
            {/* Background Circle (Subtle) */}
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" className="text-primary/10" />

            {/* The Pulse Loop - A single continuous path */}
            <path
              d="M20 50 C 20 30, 35 15, 50 15 C 65 15, 80 30, 80 50 C 80 70, 65 85, 50 85 C 35 85, 20 70, 20 50 Z"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className="text-primary/20"
            />

            <path
              d="M20 50 H 35 L 42 25 L 58 75 L 65 50 H 80"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary animate-[draw-pulse_4s_linear_infinite]"
              style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
            />

            {/* A glowing dot that follows the pulse */}
            <circle r="4" fill="currentColor" className="text-primary animate-[move-dot_4s_linear_infinite]">
              <animateMotion
                path="M20 50 H 35 L 42 25 L 58 75 L 65 50 H 80"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        {!iconOnly && (
          <div className="flex flex-col -space-y-1">
            <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300">
              Pulse<span className="text-primary group-hover:text-foreground transition-colors duration-300">Loop</span>
            </span>
          </div>
        )}

        <style dangerouslySetInnerHTML={{
          __html: `
        @keyframes draw-pulse {
          0% { stroke-dashoffset: 200; }
          30% { stroke-dashoffset: 0; }
          70% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -200; }
        }
        @keyframes move-dot {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 1; }
        }
      `}} />
      </div>
  );

  if (noLink) return content;

  return (
    <Link to="/" className="cursor-pointer">
      {content}
    </Link>
  );
}

export default Logo;