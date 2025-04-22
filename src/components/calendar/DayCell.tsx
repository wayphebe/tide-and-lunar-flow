import { Link } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MoonPhaseDisplay } from "../MoonPhaseDisplay";
import { type MoonPhase } from "@/utils/lunarPhaseCalculator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface TidePrediction {
  time: string;
  height: number;
  isHighTide: boolean;
}

interface DayCellProps {
  date: Date;
  day: number;
  moonPhase: MoonPhase;
  isCurrentMonth: boolean;
  tides?: TidePrediction[];
  isSelected: boolean;
  isToday: boolean;
  onSelect: (date: Date) => void;
}

const DayCell = ({
  date,
  day,
  moonPhase,
  isCurrentMonth,
  tides,
  isSelected,
  isToday,
  onSelect,
}: DayCellProps) => {
  const dateString = format(date, "yyyy-MM-dd");
  
  const getTideSurfStatus = () => {
    if (!tides?.length) return null;
    
    // Get the highest tide of the day
    const maxTide = Math.max(...tides.map(t => t.height));
    // Get the lowest tide of the day
    const minTide = Math.min(...tides.map(t => t.height));
    // Calculate the tide range
    const tideRange = maxTide - minTide;
    
    // Simple surf condition assessment based on tide range
    if (tideRange > 1.5) return "🏄‍♂️ Good"; // Good surf conditions with significant tide change
    if (tideRange > 0.8) return "👌 Fair"; // Moderate conditions
    return "🌊 Flat"; // Not ideal for surfing
  };

  return (
    <div 
      className={cn(
        "calendar-day min-h-24 relative group",
        !isCurrentMonth && "opacity-40",
        isToday && "ring-1 ring-moon-dark",
        isSelected && "active"
      )}
      onClick={() => onSelect(date)}
    >
      <div className="absolute top-1 right-2 text-sm">
        {day}
      </div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={`/moon/${dateString}`}>
            <MoonPhaseDisplay 
              phase={moonPhase} 
              className="mt-4"
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div className="font-medium">{moonPhase.name}</div>
            <div className="text-muted-foreground text-xs">
              照明度: {Math.round(moonPhase.illumination * 100)}%
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
      
      {isCurrentMonth && tides && tides.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={`/tide/${dateString}`} className="mt-2 flex items-center justify-center">
              <div className="text-xs font-medium">{getTideSurfStatus()}</div>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              潮差: {(Math.max(...tides.map(t => t.height)) - Math.min(...tides.map(t => t.height))).toFixed(1)}m
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default DayCell;
