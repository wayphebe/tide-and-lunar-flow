
import { cn } from "@/lib/utils";
import { type TidePoint } from "@/utils/tidePredictor";

interface TideTimelineProps {
  tides: TidePoint[];
  className?: string;
  compact?: boolean;
}

export const TideTimeline = ({ tides, className, compact = false }: TideTimelineProps) => {
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
        
        {/* Grid lines with gradient opacity */}
        <div className="absolute inset-0">
          <div className="h-full w-full grid grid-cols-4 gap-0">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="border-l border-border/10 h-full"
                style={{
                  background: i === 0 ? undefined : `linear-gradient(to right, rgba(14, 165, 233, 0.02), rgba(14, 165, 233, 0.04))`
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-4 gap-0">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="border-b border-border/10"
              />
            ))}
          </div>
        </div>
        
        {/* Smooth curve using bezier */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Gradient fill under the curve */}
          <defs>
            <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(14, 165, 233, 0.3)" />
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0)" />
            </linearGradient>
          </defs>
          
          {/* Fill area under the curve */}
          <path
            d={`
              M 0 100
              ${tides.map((tide, i) => {
                const [hours, minutes] = tide.time.split(':').map(Number);
                const timeAsMinutes = hours * 60 + minutes;
                const x = (timeAsMinutes / (24 * 60)) * 100;
                const y = 100 - getHeightPercentage(tide.height);
                
                if (i === 0) return `M ${x} ${y}`;
                
                // Calculate control points for smooth curve
                const prevTide = tides[i - 1];
                const [prevHours, prevMinutes] = prevTide.time.split(':').map(Number);
                const prevTimeAsMinutes = prevHours * 60 + prevMinutes;
                const prevX = (prevTimeAsMinutes / (24 * 60)) * 100;
                const prevY = 100 - getHeightPercentage(prevTide.height);
                
                // Control points at 1/3 and 2/3 between points
                const cp1x = prevX + (x - prevX) / 3;
                const cp2x = prevX + 2 * (x - prevX) / 3;
                
                return `C ${cp1x} ${prevY} ${cp2x} ${y} ${x} ${y}`;
              }).join(' ')}
              L 100 100 L 0 100
            `}
            fill="url(#tideGradient)"
          />
          
          {/* Main curve line */}
          <path
            d={`
              ${tides.map((tide, i) => {
                const [hours, minutes] = tide.time.split(':').map(Number);
                const timeAsMinutes = hours * 60 + minutes;
                const x = (timeAsMinutes / (24 * 60)) * 100;
                const y = 100 - getHeightPercentage(tide.height);
                
                if (i === 0) return `M ${x} ${y}`;
                
                // Calculate control points for smooth curve
                const prevTide = tides[i - 1];
                const [prevHours, prevMinutes] = prevTide.time.split(':').map(Number);
                const prevTimeAsMinutes = prevHours * 60 + prevMinutes;
                const prevX = (prevTimeAsMinutes / (24 * 60)) * 100;
                const prevY = 100 - getHeightPercentage(prevTide.height);
                
                // Control points at 1/3 and 2/3 between points
                const cp1x = prevX + (x - prevX) / 3;
                const cp2x = prevX + 2 * (x - prevX) / 3;
                
                return `C ${cp1x} ${prevY} ${cp2x} ${y} ${x} ${y}`;
              }).join(' ')}
            `}
            fill="none"
            stroke="rgba(14, 165, 233, 0.7)"
            strokeWidth="2"
            className="drop-shadow-[0_2px_4px_rgba(14,165,233,0.2)]"
          />
          
          {/* Tide points */}
          {tides.map((tide, index) => {
            const [hours, minutes] = tide.time.split(':').map(Number);
            const timeAsMinutes = hours * 60 + minutes;
            const x = (timeAsMinutes / (24 * 60)) * 100;
            const y = 100 - getHeightPercentage(tide.height);
            
            return (
              <g key={index}>
                {/* Larger glowing circle for high tides */}
                {tide.isHighTide && (
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    className="fill-ocean/20"
                    filter="url(#glow)"
                  />
                )}
                {/* Main point */}
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  className={cn(
                    "fill-ocean stroke-background stroke-2",
                    tide.isHighTide ? "opacity-100" : "opacity-70"
                  )}
                />
                
                {/* Label */}
                {!compact && (
                  <g transform={`translate(${x}%, ${y + 5}%)`}>
                    <text
                      className="text-[10px] fill-muted-foreground"
                      textAnchor="middle"
                      y="15"
                    >
                      {tide.time}
                    </text>
                    <text
                      className="text-[10px] fill-muted-foreground"
                      textAnchor="middle"
                      y="25"
                    >
                      {tide.height.toFixed(1)}m
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          
          {/* SVG Filters */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
};
