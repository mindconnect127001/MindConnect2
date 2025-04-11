import { apiRequest } from "@/lib/queryClient";

interface EmailParams {
  to: string;
  subject: string;
  body: string;
}

export const EmailService = {
  // In a real implementation, this would send emails through the backend
  async sendEmail(params: EmailParams): Promise<boolean> {
    try {
      const response = await apiRequest('POST', '/api/email/send', params);
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  },
  
  async sendAppointmentConfirmation(
    email: string, 
    patientName: string, 
    date: Date, 
    type: string, 
    zoomLink: string, 
    zoomPassword: string
  ): Promise<boolean> {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
    
    const subject = 'MindConnect: Your Appointment Confirmation';
    const body = `
      Hello ${patientName},
      
      Your appointment with MindConnect has been confirmed for ${formattedDate}.
      
      Appointment Details:
      - Type: ${type}
      - Date and Time: ${formattedDate}
      
      To join the appointment, please use the following Zoom link:
      ${zoomLink}
      
      Password: ${zoomPassword}
      
      If you need to reschedule or cancel your appointment, please visit our website or contact us directly.
      
      Thank you for choosing MindConnect for your telehealth needs.
      
      Best regards,
      The MindConnect Team
    `;
    
    return this.sendEmail({
      to: email,
      subject,
      body
    });
  }
};
