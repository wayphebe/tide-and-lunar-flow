
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MoonPhaseDisplay } from "../MoonPhaseDisplay";
import { type MoonPhase } from "@/utils/lunarPhaseCalculator";

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

  return (
    <div 
      className={cn(
        "calendar-day min-h-24",
        !isCurrentMonth && "opacity-40",
        isToday && "ring-1 ring-moon-dark",
        isSelected && "active"
      )}
      onClick={() => onSelect(date)}
    >
      <div className="absolute top-1 right-2 text-sm">
        {day}
      </div>
      
      <Link to={`/moon/${dateString}`}>
        <MoonPhaseDisplay 
          phase={moonPhase} 
          className="mt-4"
        />
      </Link>
      
      {isCurrentMonth && tides && tides.length > 0 && (
        <Link to={`/tide/${dateString}`} className="mt-2 flex flex-col items-center">
          <div className="text-xs text-muted-foreground">潮汐</div>
          <div className="flex space-x-1 mt-1">
            {tides.map((tide, index) => (
              <div 
                key={index}
                className={cn(
                  "tide-marker",
                  tide.isHighTide ? "high" : "low"
                )}
                title={`${tide.time} - ${tide.height.toFixed(1)}m`}
              />
            ))}
          </div>
        </Link>
      )}
    </div>
  );
};

export default DayCell;
