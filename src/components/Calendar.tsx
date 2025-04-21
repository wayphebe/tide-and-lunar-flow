
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoonPhaseDisplay } from "./MoonPhaseDisplay";
import { calculateMoonPhase, getMoonPhases } from "@/utils/lunarPhaseCalculator";
import { useLocationStore } from "@/stores/locationStore";
import { getMonthTidePredictions } from "@/utils/tidePredictor";
import { format, addMonths, subMonths } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const Calendar = () => {
  const { currentLocation } = useLocationStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  if (!currentLocation) {
    return <div className="text-center py-8">请选择一个位置</div>;
  }
  
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  // Get all moon phases for the current month
  const moonPhases = getMoonPhases(currentMonth, currentYear);
  
  // Get tide predictions for the current month
  const tidePredictions = currentLocation 
    ? getMonthTidePredictions(currentMonth, currentYear, currentLocation)
    : {};
  
  // Calculate days in month and first day of month
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
  
  // Previous month days to show
  const prevMonthDays = [];
  const prevMonthDaysCount = firstDayOfMonth;
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = new Date(prevMonthYear, prevMonth, 0).getDate();
  
  for (let i = prevMonthDaysCount - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(prevMonthYear, prevMonth - 1, day);
    prevMonthDays.push({
      date,
      day,
      moonPhase: calculateMoonPhase(date),
      isCurrentMonth: false
    });
  }
  
  // Current month days
  const currentMonthDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth - 1, day);
    currentMonthDays.push({
      date,
      day,
      moonPhase: moonPhases[day],
      isCurrentMonth: true,
      tides: tidePredictions[day] || []
    });
  }
  
  // Next month days to show
  const nextMonthDays = [];
  const totalDaysShown = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysCount = totalDaysShown > 35 ? 42 - totalDaysShown : 35 - totalDaysShown;
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;
  
  for (let day = 1; day <= nextMonthDaysCount; day++) {
    const date = new Date(nextMonthYear, nextMonth - 1, day);
    nextMonthDays.push({
      date,
      day,
      moonPhase: calculateMoonPhase(date),
      isCurrentMonth: false
    });
  }
  
  // All days to display
  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  
  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{format(currentDate, "yyyy年MM月")}</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          
          <Select
            value={currentMonth.toString()}
            onValueChange={(value) => {
              const newDate = new Date(currentDate);
              newDate.setMonth(parseInt(value) - 1);
              setCurrentDate(newDate);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="月份" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {month}月
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-border/20 rounded-lg overflow-hidden">
        {/* Weekday headers */}
        {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
          <div key={day} className="p-2 text-center font-medium bg-ocean-dark/50">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {allDays.map(({ date, day, moonPhase, isCurrentMonth, tides }) => {
          const dateString = format(date, "yyyy-MM-dd");
          const isToday = format(new Date(), "yyyy-MM-dd") === dateString;
          const isSelected = format(selectedDate, "yyyy-MM-dd") === dateString;
          
          return (
            <div 
              key={dateString}
              className={cn(
                "calendar-day min-h-24",
                !isCurrentMonth && "opacity-40",
                isToday && "ring-1 ring-moon-dark",
                isSelected && "active"
              )}
              onClick={() => handleDateSelect(date)}
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
        })}
      </div>
    </div>
  );
};

export default Calendar;

// Helper function to concatenate classnames
const cn = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};
