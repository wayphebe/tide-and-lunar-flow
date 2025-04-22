
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
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
        <clipPath id="moonClip">
          <path d="M12 3a9 9 0 0 0 0 18c5.285 0 9-3.75 9-9s-3.715-9-9-9z" />
        </clipPath>
      </defs>
      <path 
        d="M12 3a9 9 0 0 0 0 18c5.285 0 9-3.75 9-9s-3.715-9-9-9z"
        fill="url(#moonGradient)"
        clipPath="url(#moonClip)"
        strokeWidth="1"
        stroke="currentColor"
        strokeOpacity="0.3"
      />
      <circle 
        cx="16" 
        cy="7" 
        r="1" 
        fill="currentColor" 
        fillOpacity="0.2"
      />
      <circle 
        cx="14" 
        cy="10" 
        r="0.5" 
        fill="currentColor" 
        fillOpacity="0.1"
      />
    </svg>
  );
};
