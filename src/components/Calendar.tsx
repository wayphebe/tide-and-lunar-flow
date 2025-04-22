
import { useState } from "react";
import { addMonths, subMonths } from "date-fns";
import { useLocationStore } from "@/stores/locationStore";
import CalendarHeader from "./calendar/CalendarHeader";
import CalendarGrid from "./calendar/CalendarGrid";
import { calculateCalendarDays } from "@/utils/calendarUtils";

const Calendar = () => {
  const { currentLocation } = useLocationStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  if (!currentLocation) {
    return <div className="text-center py-8">请选择一个位置</div>;
  }
  
  const days = calculateCalendarDays(currentDate, currentLocation);
  const currentMonth = currentDate.getMonth() + 1;
  
  return (
    <div className="space-y-4">
      <CalendarHeader
        currentDate={currentDate}
        onPreviousMonth={() => setCurrentDate(subMonths(currentDate, 1))}
        onNextMonth={() => setCurrentDate(addMonths(currentDate, 1))}
        onMonthSelect={(value) => {
          const newDate = new Date(currentDate);
          newDate.setMonth(parseInt(value) - 1);
          setCurrentDate(newDate);
        }}
        currentMonth={currentMonth}
      />
      
      <CalendarGrid
        days={days}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
    </div>
  );
};

export default Calendar;
