
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMonthSelect: (month: string) => void;
  currentMonth: number;
}

const CalendarHeader = ({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onMonthSelect,
  currentMonth,
}: CalendarHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{format(currentDate, "yyyy年MM月")}</h1>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={onPreviousMonth}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        
        <Select
          value={currentMonth.toString()}
          onValueChange={onMonthSelect}
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
        
        <Button variant="outline" size="icon" onClick={onNextMonth}>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
