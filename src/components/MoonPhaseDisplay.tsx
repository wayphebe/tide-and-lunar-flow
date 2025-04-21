
import { cn } from "@/lib/utils";
import { type MoonPhase } from "@/utils/lunarPhaseCalculator";

interface MoonPhaseDisplayProps {
  phase: MoonPhase;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
}

export const MoonPhaseDisplay = ({ 
  phase, 
  className,
  size = "md",
  showLabel = false
}: MoonPhaseDisplayProps) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-xl"
  };
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-moon/30 to-moon-dark/10 relative",
        sizeClasses[size]
      )}>
        <span className="text-2xl" role="img" aria-label={phase.name}>
          {phase.emoji}
        </span>
        <div className="absolute inset-0 moon-glow opacity-60"></div>
      </div>
      
      {showLabel && (
        <div className="mt-1 text-center">
          <p className="text-sm font-medium">{phase.name}</p>
          <p className="text-xs text-muted-foreground">
            {Math.round(phase.illumination * 100)}% 照明
          </p>
        </div>
      )}
    </div>
  );
};
