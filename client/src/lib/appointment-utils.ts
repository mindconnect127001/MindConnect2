import { apiRequest } from "@/lib/queryClient";
import { generateTimeSlots } from "@/components/ui/time-picker";
import { Appointment, Questionnaire } from "@shared/schema";

// Get an array of dates that have available appointment slots
export async function getAvailableDates(startDate: Date, endDate: Date): Promise<Date[]> {
  try {
    // Format dates for API
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    const response = await apiRequest('GET', `/api/availability?start=${start}&end=${end}`, undefined);
    const data = await response.json();
    
    // Convert string dates to Date objects
    return data.available_dates.map((dateStr: string) => new Date(dateStr));
  } catch (error) {
    console.error('Error fetching available dates:', error);
    return [];
  }
}

// Get all available time slots for a specific date
export async function getAvailableTimeSlots(date: Date) {
  try {
    const dateString = date.toISOString().split('T')[0];
    const response = await apiRequest('GET', `/api/appointments/available-times?date=${dateString}`, undefined);
    const data = await response.json();
    
    // Generate time slots with unavailable times marked
    return generateTimeSlots(9, 17, 60, data.unavailable_times || []);
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    // Default to business hours if we can't fetch
    return generateTimeSlots(9, 17, 60, []);
  }
}

// Create a new appointment
export async function createAppointment(appointmentData: {
  patientName: string;
  patientEmail: string;
  date: Date;
  type: string;
  questionnaire?: Questionnaire;
}): Promise<Appointment> {
  try {
    const response = await apiRequest('POST', '/api/appointments', appointmentData);
    return await response.json();
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

// Save questionnaire locally
export function saveQuestionnaireToLocalStorage(questionnaire: Questionnaire): void {
  localStorage.setItem('mindconnect_questionnaire', JSON.stringify(questionnaire));
}

// Retrieve questionnaire from local storage
export function getQuestionnaireFromLocalStorage(): Questionnaire | null {
  const data = localStorage.getItem('mindconnect_questionnaire');
  if (!data) return null;
  
  try {
    return JSON.parse(data) as Questionnaire;
  } catch (error) {
    console.error('Error parsing questionnaire from localStorage:', error);
    return null;
  }
}

// Clear questionnaire from local storage (after appointment is complete)
export function clearQuestionnaireFromLocalStorage(): void {
  localStorage.removeItem('mindconnect_questionnaire');
}
