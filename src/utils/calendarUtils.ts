
import { calculateMoonPhase, getMoonPhases } from "./lunarPhaseCalculator";
import { getMonthTidePredictions } from "./tidePredictor";
import { type Location } from "../stores/locationStore";

export interface CalendarDay {
  date: Date;
  day: number;
  moonPhase: any; // Using any temporarily, should use proper type from lunarPhaseCalculator
  isCurrentMonth: boolean;
  tides?: Array<{
    time: string;
    height: number;
    isHighTide: boolean;
  }>;
}

export const calculateCalendarDays = (
  currentDate: Date,
  currentLocation: Location | null
): CalendarDay[] => {
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  // Get moon phases and tide predictions
  const moonPhases = getMoonPhases(currentMonth, currentYear);
  const tidePredictions = currentLocation 
    ? getMonthTidePredictions(currentMonth, currentYear, currentLocation)
    : {};
  
  // Calculate calendar grid parameters
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
  
  // Calculate previous month days
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
  
  // Calculate current month days
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
  
  // Calculate next month days
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
  
  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
};
