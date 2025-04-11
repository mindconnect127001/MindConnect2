import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  disabledDates?: Date[];
}

export function DatePicker({ date, onDateChange, disabledDates }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Select a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            onDateChange(date);
            setOpen(false);
          }}
          disabled={[
            {
              before: new Date(),
            },
            ...(disabledDates || []),
          ]}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

interface DatePickerCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date) => void;
  availableDates?: Date[];
}

export function DatePickerCalendar({ selectedDate, onDateSelect, availableDates }: DatePickerCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Function to check if date is in available dates
  const isDateAvailable = (date: Date): boolean => {
    if (!availableDates) return true;
    
    return availableDates.some(availableDate => 
      availableDate.getDate() === date.getDate() &&
      availableDate.getMonth() === date.getMonth() &&
      availableDate.getFullYear() === date.getFullYear()
    );
  };
  
  // Function to disable dates based on availability
  const isDateDisabled = (date: Date): boolean => {
    // Disable past dates
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
    
    // Disable weekends (0 is Sunday, 6 is Saturday)
    const day = date.getDay();
    if (day === 0 || day === 6) return true;
    
    // Disable dates that are not in availableDates if provided
    if (availableDates && !isDateAvailable(date)) return true;
    
    return false;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex justify-between items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const prevMonth = new Date(currentMonth);
              prevMonth.setMonth(prevMonth.getMonth() - 1);
              setCurrentMonth(prevMonth);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const nextMonth = new Date(currentMonth);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              setCurrentMonth(nextMonth);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          disabled={date => isDateDisabled(date)}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
}
