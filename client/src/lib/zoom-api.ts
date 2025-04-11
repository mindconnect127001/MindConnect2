import { apiRequest } from "@/lib/queryClient";

export interface ZoomMeeting {
  id: string;
  join_url: string;
  password: string;
  start_time: string;
}

export interface CreateMeetingParams {
  topic: string;
  start_time: string;
  duration: number;
  timezone?: string;
}

// This service would be connected to the real Zoom API in production
// For now, it uses our backend API as a proxy to the Zoom API
export const ZoomService = {
  async createMeeting(params: CreateMeetingParams): Promise<ZoomMeeting> {
    try {
      // In a real implementation, this would directly call the Zoom API
      // Our backend API will handle the Zoom integration
      const response = await apiRequest('POST', '/api/zoom/create-meeting', params);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating Zoom meeting:', error);
      throw error;
    }
  },
  
  // Generate a meeting link from our appointment data
  // This is a helper function that would be replaced with actual Zoom API calls
  async getZoomLinkFromAppointment(appointmentId: number): Promise<string> {
    try {
      const response = await apiRequest('GET', `/api/appointments/${appointmentId}`, undefined);
      const appointment = await response.json();
      
      if (appointment.zoomMeetingUrl) {
        return appointment.zoomMeetingUrl;
      } else {
        throw new Error('No Zoom meeting URL found for this appointment');
      }
    } catch (error) {
      console.error('Error getting Zoom link:', error);
      throw error;
    }
  }
};
