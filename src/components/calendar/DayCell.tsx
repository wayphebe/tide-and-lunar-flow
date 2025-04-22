
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
  
  const getTideStatus = () => {
    if (!tides?.length) return null;
    const highTides = tides.filter(t => t.isHighTide).length;
    const lowTides = tides.filter(t => !t.isHighTide).length;
    return `${highTides} 涨潮 · ${lowTides} 退潮`;
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
            <Link to={`/tide/${dateString}`} className="mt-2 flex flex-col items-center">
              <div className="text-xs text-muted-foreground">{getTideStatus()}</div>
              <div className="flex space-x-1 mt-1">
                {tides.map((tide, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "h-1 w-1 rounded-full transition-all duration-200",
                      tide.isHighTide 
                        ? "bg-ocean hover:bg-ocean/80" 
                        : "bg-ocean-light hover:bg-ocean-light/80"
                    )}
                  />
                ))}
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              {tides.map((tide, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span>{tide.isHighTide ? "涨潮" : "退潮"}</span>
                  <span className="ml-2 text-muted-foreground">
                    {tide.time} ({tide.height.toFixed(1)}m)
                  </span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default DayCell;
