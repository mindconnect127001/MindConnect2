import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerCalendar } from "@/components/ui/date-picker";
import { TimePicker, generateTimeSlots } from "@/components/ui/time-picker";
import { CalendarIcon, ShieldCheck } from "lucide-react";
import { getAvailableTimeSlots } from "@/lib/appointment-utils";

export default function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  // Get time slots for the selected date
  const { data: timeSlots, isLoading: timeSlotsLoading } = useQuery({
    queryKey: ['/api/appointments/available-times', selectedDate?.toISOString().split('T')[0]],
    queryFn: async () => {
      if (!selectedDate) return generateTimeSlots();
      return await getAvailableTimeSlots(selectedDate);
    },
    enabled: !!selectedDate, // Only run when a date is selected
  });

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time selection when date changes
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Handle continue to next step
  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;
    
    // Store selection in localStorage to persist through the flow
    localStorage.setItem('appointment_date', selectedDate.toISOString());
    localStorage.setItem('appointment_time', selectedTime);
    
    // Navigate to patient information page
    setLocation('/patient-info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:grid md:grid-cols-12 md:gap-8">
        {/* Left Column (Calendar) */}
        <div className="md:col-span-8 space-y-6">
          {/* Appointment Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-neutral-800">Schedule Your Telehealth Appointment</h2>
                
                {/* Step Indicator */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-neutral-200"></div>
                  </div>
                  <div className="relative flex justify-between">
                    <div className="flex items-center">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">1</span>
                      <span className="ml-2 text-sm font-medium text-neutral-700">Select Date & Time</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 text-sm font-medium">2</span>
                      <span className="ml-2 text-sm font-medium text-neutral-500">Patient Information</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 text-sm font-medium">3</span>
                      <span className="ml-2 text-sm font-medium text-neutral-500">Confirmation</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Calendar */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-neutral-800 mb-4">Select a Date</h3>
              <DatePickerCalendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
              
              <h3 className="text-lg font-medium text-neutral-800 my-4">Available Time Slots</h3>
              {selectedDate ? (
                timeSlotsLoading ? (
                  <div className="py-4 text-center text-neutral-500">Loading available times...</div>
                ) : (
                  <TimePicker 
                    timeSlots={timeSlots || []}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelect}
                  />
                )
              ) : (
                <div className="py-4 text-center text-neutral-500">Please select a date to view available times</div>
              )}
            </CardContent>
          </Card>
          
          {/* Appointment Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-neutral-800 mb-3">Appointment Details</h3>
              <div className="space-y-4">
                <div className="flex space-x-2 items-start">
                  <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    {selectedDate && selectedTime ? (
                      <>
                        <p className="font-medium text-neutral-800">
                          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-neutral-500">{selectedTime} - {calculateEndTime(selectedTime, 45)} (45 minutes)</p>
                      </>
                    ) : (
                      <p className="text-neutral-500">Select a date and time to continue</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 items-start">
                  <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-800">Virtual Consultation</p>
                    <p className="text-neutral-500">Zoom meeting link will be provided</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button 
                    onClick={handleContinue}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full"
                  >
                    Continue to Patient Information
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column (Info) */}
        <div className="md:col-span-4 mt-8 md:mt-0">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-neutral-800 mb-4">About Your Appointment</h3>
              <div className="space-y-4 text-sm">
                <p>
                  Your virtual telehealth consultation will be conducted through Zoom, allowing you to connect with Technician Aaron Harmon from the comfort of your home.
                </p>
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-blue-800 mb-2">What to Expect</h4>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>A secure Zoom link will be provided after scheduling</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Please join 5 minutes before your appointment time</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ensure you have a quiet, private space for your session</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Initial consultations are 45 minutes in length</span>
                    </li>
                  </ul>
                </div>
                <p>
                  After selecting your appointment time, you'll be asked to provide some basic information and complete a short questionnaire to help us better understand your needs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate end time
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [time, period] = startTime.split(' ');
  const [hourStr, minuteStr] = time.split(':');
  
  let hour = parseInt(hourStr);
  let minute = parseInt(minuteStr);
  
  // Convert to 24-hour format
  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  
  // Add duration minutes
  minute += durationMinutes;
  hour += Math.floor(minute / 60);
  minute = minute % 60;
  
  // Convert back to 12-hour format
  let newPeriod = 'AM';
  if (hour >= 12) {
    newPeriod = 'PM';
    if (hour > 12) {
      hour -= 12;
    }
  }
  if (hour === 0) {
    hour = 12;
  }
  
  return `${hour}:${minute.toString().padStart(2, '0')} ${newPeriod}`;
}
