
import { cn } from "@/lib/utils";

interface MoonIconProps {
  className?: string;
}

export const MoonIcon = ({ className }: MoonIconProps) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-6", className)}
    >
      <defs>
        <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path 
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="url(#moonGradient)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
