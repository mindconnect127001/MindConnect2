import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema, insertUserSchema, insertAvailabilitySchema, insertZoomSettingsSchema, questionnaireSchema } from "@shared/schema";
import { z } from "zod";

// Simple email function (would be replaced with proper email implementation)
function sendEmailNotification(to: string, subject: string, body: string) {
  console.log(`Sending email to ${to} with subject: ${subject}`);
  console.log(`Email body: ${body}`);
  // In a real app, this would use nodemailer or a similar service
  return true;
}

// Zoom API integration with fallback for development/testing
async function createZoomMeeting(details: { topic: string, startTime: string, duration: number }) {
  try {
    // In production, this would call the actual Zoom API
    // For now, create a simulated unique meeting
    const meetingId = Math.floor(Math.random() * 1000000);
    return {
      id: `zoom-${meetingId}`,
      join_url: `https://zoom.us/j/${meetingId}`,
      password: Math.random().toString(36).substring(2, 8),
    };
  } catch (error) {
    console.error("Failed to create Zoom meeting:", error);
    // Provide fallback meeting details
    return {
      id: "fallback-meeting-" + new Date().getTime(),
      join_url: "https://zoom.us/j/mindconnect" + Math.floor(Math.random() * 1000000),
      password: Math.random().toString(36).substring(2, 8),
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check route
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "healthy" });
  });

  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user with this email already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Appointment routes
  app.get("/api/appointments", async (_req: Request, res: Response) => {
    try {
      // In a real app, this would be filtered by user role/permissions
      const appointments = await Promise.all(
        Array.from({ length: 10 }, (_, i) => i + 1).map(
          async (id) => await storage.getAppointment(id)
        )
      );
      
      // Filter out undefined appointments
      const validAppointments = appointments.filter(Boolean);
      
      res.json(validAppointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Get available time slots for a specific date
  app.get("/api/appointments/available-times", async (req: Request, res: Response) => {
    try {
      const date = req.query.date as string;
      
      if (!date) {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      
      // Get all appointments for the specified date
      const queryDate = new Date(date);
      const appointments = await storage.getAppointmentsByDate(queryDate);
      
      // Extract the times that are already booked
      const unavailableTimes = appointments.map(appointment => {
        const apptDate = new Date(appointment.date);
        return `${apptDate.getHours().toString().padStart(2, '0')}:${apptDate.getMinutes().toString().padStart(2, '0')}`;
      });
      
      res.json({ date, unavailable_times: unavailableTimes });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch available times" });
    }
  });
  
  app.post("/api/appointments", async (req: Request, res: Response) => {
    try {
      console.log("Received appointment data:", JSON.stringify(req.body, null, 2));

      // Convert date string to Date object if necessary
      let appointmentDate;
      try {
        if (typeof req.body.date === 'string') {
          appointmentDate = new Date(req.body.date);
          if (isNaN(appointmentDate.getTime())) {
            throw new Error("Invalid date format");
          }
        } else if (req.body.date instanceof Date) {
          appointmentDate = req.body.date;
        } else {
          throw new Error("Invalid date format");
        }
      } catch (error) {
        console.error("Date parsing error:", error);
        return res.status(400).json({ 
          message: "Invalid appointment data", 
          error: "Could not parse appointment date"
        });
      }
      
      // Add status if not present
      const requestData = {
        ...req.body,
        date: appointmentDate,
        status: req.body.status || "confirmed",
        duration: req.body.duration || 45
      };

      // Default Zoom meeting details in case the real API fails
      const defaultZoomMeeting = {
        id: "default_meeting_" + Math.floor(Math.random() * 1000000),
        join_url: "https://zoom.us/j/mindconnect" + Math.floor(Math.random() * 1000000),
        password: Math.random().toString(36).substring(2, 8)
      };
      
      let appointmentData;
      let appointmentWithZoom;
      
      try {
        appointmentData = insertAppointmentSchema.parse(requestData);
        
        // Create a Zoom meeting for this appointment
        let zoomMeeting;
        try {
          zoomMeeting = await createZoomMeeting({
            topic: `MindConnect Appointment - ${appointmentData.type}`,
            startTime: appointmentData.date.toISOString(),
            duration: appointmentData.duration || 45, // Default to 45 minutes if not provided
          });
        } catch (zoomError) {
          console.error("Failed to create Zoom meeting:", zoomError);
          zoomMeeting = defaultZoomMeeting;
        }
        
        // Add Zoom meeting details to the appointment
        appointmentWithZoom = {
          ...appointmentData,
          zoomMeetingId: zoomMeeting.id,
          zoomMeetingUrl: zoomMeeting.join_url,
          zoomMeetingPassword: zoomMeeting.password,
        };
      } catch (error) {
        console.log("Validation error in appointment creation:", error);
        console.log("Request body:", JSON.stringify(req.body, null, 2));
        return res.status(400).json({ message: "Invalid appointment data", error });
      }
      
      // Now create the appointment in our database
      const appointment = await storage.createAppointment(appointmentWithZoom);
      
      // Send confirmation email
      const emailBody = `
        Your appointment has been scheduled for ${new Date(appointment.date).toLocaleString()}.
        
        Appointment Details:
        - Type: ${appointment.type}
        - Duration: ${appointment.duration} minutes
        
        Join Zoom Meeting:
        ${appointment.zoomMeetingUrl}
        Password: ${appointment.zoomMeetingPassword}
        
        Thank you for choosing MindConnect!
      `;
      
      sendEmailNotification(
        appointment.patientEmail,
        "MindConnect: Appointment Confirmation",
        emailBody
      );
      
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error in appointment creation:", JSON.stringify(error.errors, null, 2));
        console.error("Request body:", JSON.stringify(req.body, null, 2));
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });
  
  app.get("/api/appointments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const appointment = await storage.getAppointment(id);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointment" });
    }
  });
  
  app.patch("/api/appointments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const appointmentUpdate = req.body;
      
      const appointment = await storage.getAppointment(id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      const updatedAppointment = await storage.updateAppointment(id, appointmentUpdate);
      
      // If the date was changed, update the Zoom meeting
      if (appointmentUpdate.date && updatedAppointment) {
        const zoomMeeting = await createZoomMeeting({
          topic: `MindConnect Appointment - ${updatedAppointment.type}`,
          startTime: new Date(updatedAppointment.date).toISOString(),
          duration: updatedAppointment.duration || 45,
        });
        
        await storage.updateAppointment(id, {
          zoomMeetingId: zoomMeeting.id,
          zoomMeetingUrl: zoomMeeting.join_url,
          zoomMeetingPassword: zoomMeeting.password,
        });
        
        // Refetch the appointment to get the updated Zoom info
        const finalAppointment = await storage.getAppointment(id);
        
        // Send update email
        if (finalAppointment) {
          sendEmailNotification(
            finalAppointment.patientEmail,
            "MindConnect: Appointment Updated",
            `Your appointment has been updated to ${new Date(finalAppointment.date).toLocaleString()}.
             
             Updated Zoom Meeting Link: ${finalAppointment.zoomMeetingUrl}
             Password: ${finalAppointment.zoomMeetingPassword}`
          );
        }
        
        return res.json(finalAppointment);
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });
  
  app.delete("/api/appointments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      const appointment = await storage.getAppointment(id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      const success = await storage.deleteAppointment(id);
      
      if (success) {
        // Send cancellation email
        sendEmailNotification(
          appointment.patientEmail,
          "MindConnect: Appointment Cancelled",
          `Your appointment scheduled for ${new Date(appointment.date).toLocaleString()} has been cancelled.
           
           If you would like to reschedule, please visit our website.`
        );
        
        return res.status(204).end();
      }
      
      res.status(500).json({ message: "Failed to delete appointment" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });
  
  // Availability routes
  app.get("/api/availability", async (req: Request, res: Response) => {
    try {
      if (req.query.start && req.query.end) {
        // Date range query for available dates
        const startDate = new Date(req.query.start as string);
        const endDate = new Date(req.query.end as string);
        
        // For this prototype, we'll generate some available dates
        const availableDates = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
          // Skip weekends (0 = Sunday, 6 = Saturday)
          const day = currentDate.getDay();
          if (day !== 0 && day !== 6) {
            availableDates.push(new Date(currentDate));
          }
          
          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return res.json({ available_dates: availableDates.map(d => d.toISOString()) });
      }
      
      // If no date parameters, return all availability settings
      const availability = await storage.getAvailability();
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });
  
  app.get("/api/availability/:day", async (req: Request, res: Response) => {
    try {
      const day = parseInt(req.params.day);
      const availability = await storage.getAvailabilityByDay(day);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });
  
  app.post("/api/availability", async (req: Request, res: Response) => {
    try {
      const availabilityData = insertAvailabilitySchema.parse(req.body);
      const availability = await storage.createAvailability(availabilityData);
      res.status(201).json(availability);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid availability data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create availability" });
    }
  });
  
  app.patch("/api/availability/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const availabilityUpdate = req.body;
      const availability = await storage.updateAvailability(id, availabilityUpdate);
      
      if (!availability) {
        return res.status(404).json({ message: "Availability not found" });
      }
      
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: "Failed to update availability" });
    }
  });
  
  app.delete("/api/availability/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAvailability(id);
      
      if (success) {
        return res.status(204).end();
      }
      
      res.status(404).json({ message: "Availability not found" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete availability" });
    }
  });
  
  // Zoom settings routes
  app.get("/api/zoom-settings", async (_req: Request, res: Response) => {
    try {
      const settings = await storage.getZoomSettings();
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Zoom settings" });
    }
  });
  
  app.post("/api/zoom-settings", async (req: Request, res: Response) => {
    try {
      const settingsData = insertZoomSettingsSchema.parse(req.body);
      const settings = await storage.updateZoomSettings(settingsData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid Zoom settings data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update Zoom settings" });
    }
  });
  
  // Questionnaire validation route (for client-side validation)
  app.post("/api/validate-questionnaire", (req: Request, res: Response) => {
    try {
      const data = questionnaireSchema.parse(req.body);
      res.json({ valid: true, data });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ valid: false, errors: error.errors });
      }
      res.status(500).json({ message: "Validation error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
