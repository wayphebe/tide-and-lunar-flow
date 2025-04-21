
import { cn } from "@/lib/utils";
import { type TidePoint } from "@/utils/tidePredictor";

interface TideTimelineProps {
  tides: TidePoint[];
  className?: string;
  compact?: boolean;
}

export const TideTimeline = ({ tides, className, compact = false }: TideTimelineProps) => {
  // Find the max height for scaling
  const maxHeight = Math.max(...tides.map(t => t.height));
  
  const getHeightPercentage = (height: number) => {
    return (height / maxHeight) * 100;
  };
  
  return (
    <div className={cn(
      "w-full overflow-hidden rounded-md border border-border/40 bg-ocean-dark/30 p-4",
      compact ? "h-24" : "h-48",
      className
    )}>
      <div className="relative w-full h-full flex">
        {/* Time markers */}
        <div className="absolute bottom-0 w-full flex justify-between px-2 text-xs text-muted-foreground">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-4 gap-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-l border-border/20 h-full"></div>
          ))}
        </div>
        
        {/* Tide points */}
        {tides.map((tide, index) => {
          // Convert time to percentage across the x-axis
          const [hours, minutes] = tide.time.split(':').map(Number);
          const timeAsMinutes = hours * 60 + minutes;
          const xPosition = (timeAsMinutes / (24 * 60)) * 100;
          
          // Calculate y position based on height
          const heightPercentage = getHeightPercentage(tide.height);
          const yPosition = 100 - heightPercentage; // Invert since 0,0 is top-left
          
          return (
            <div 
              key={index}
              className={cn(
                "absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2",
                tide.isHighTide ? "bg-ocean" : "bg-ocean-light"
              )}
              style={{
                left: `${xPosition}%`,
                top: `${yPosition}%`
              }}
            >
              {!compact && (
                <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="text-xs font-medium">{tide.time}</div>
                  <div className="text-xs text-muted-foreground">{tide.height.toFixed(1)}m</div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Connection line */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <polyline
            points={tides.map(tide => {
              const [hours, minutes] = tide.time.split(':').map(Number);
              const timeAsMinutes = hours * 60 + minutes;
              const x = (timeAsMinutes / (24 * 60)) * 100;
              const y = 100 - getHeightPercentage(tide.height);
              return `${x}% ${y}%`;
            }).join(' ')}
            fill="none"
            stroke="rgba(14, 165, 233, 0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
