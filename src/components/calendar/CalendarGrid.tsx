
import DayCell from "./DayCell";

interface CalendarGridProps {
  days: Array<{
    date: Date;
    day: number;
    moonPhase: any; // Using any here temporarily, should use proper type from lunarPhaseCalculator
    isCurrentMonth: boolean;
    tides?: Array<{
      time: string;
      height: number;
      isHighTide: boolean;
    }>;
  }>;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarGrid = ({ days, selectedDate, onDateSelect }: CalendarGridProps) => {
  return (
    <div className="grid grid-cols-7 gap-px bg-border/20 rounded-lg overflow-hidden">
      {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
        <div key={day} className="p-2 text-center font-medium bg-ocean-dark/50">
          {day}
        </div>
      ))}
      
      {days.map(({ date, day, moonPhase, isCurrentMonth, tides }) => (
        <DayCell
          key={`${date.toString()}-${isCurrentMonth}`}
          date={date}
          day={day}
          moonPhase={moonPhase}
          isCurrentMonth={isCurrentMonth}
          tides={tides}
          isSelected={date.toDateString() === selectedDate.toDateString()}
          isToday={date.toDateString() === new Date().toDateString()}
          onSelect={onDateSelect}
        />
      ))}
    </div>
  );
};

export default CalendarGrid;
