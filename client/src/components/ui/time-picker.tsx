import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimePickerProps {
  timeSlots: TimeSlot[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export function TimePicker({ timeSlots, selectedTime, onTimeSelect }: TimePickerProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {timeSlots.map((slot) => (
        <Button
          key={slot.time}
          variant={selectedTime === slot.time ? "default" : "outline"}
          className={cn(
            "h-10",
            !slot.available && "opacity-50 cursor-not-allowed",
            selectedTime === slot.time && "bg-primary text-primary-foreground"
          )}
          disabled={!slot.available}
          onClick={() => slot.available && onTimeSelect(slot.time)}
        >
          {slot.time}
        </Button>
      ))}
    </div>
  );
}

export function generateTimeSlots(
  startHour: number = 9,
  endHour: number = 17,
  interval: number = 60,
  unavailableTimes: string[] = []
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour < 12 ? 'AM' : 'PM';
      const timeString = `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
      
      slots.push({
        time: timeString,
        available: !unavailableTimes.includes(timeString)
      });
    }
  }
  
  return slots;
}
