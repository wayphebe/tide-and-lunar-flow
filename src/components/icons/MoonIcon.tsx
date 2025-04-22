
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
      <path 
        d="M12 3a9 9 0 0 0 0 18c5.285 0 9-3.75 9-9s-3.715-9-9-9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.8"
      />
    </svg>
  );
};
