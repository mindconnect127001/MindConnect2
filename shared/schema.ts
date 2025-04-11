import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").default("patient").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
});

// Appointments Schema
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  patientName: text("patient_name").notNull(),
  patientEmail: text("patient_email").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration").default(45).notNull(), // in minutes
  type: text("type").default("Initial Consultation").notNull(),
  status: text("status").default("pending").notNull(),
  zoomMeetingId: text("zoom_meeting_id"),
  zoomMeetingUrl: text("zoom_meeting_url"),
  zoomMeetingPassword: text("zoom_meeting_password"),
  questionnaire: jsonb("questionnaire"),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
});

// Questionnaire schema for form validation
export const questionnaireSchema = z.object({
  overallMood: z.number().min(1).max(10),
  anxietyFrequency: z.number().min(1).max(10),
  sleepAbility: z.number().min(1).max(10),
  stressFrequency: z.number().min(1).max(10),
  difficultyHandling: z.number().min(1).max(10),
  overwhelmedFrequency: z.number().min(1).max(10),
  sadnessFrequency: z.number().min(1).max(10),
  connectionToOthers: z.number().min(1).max(10),
  negativeThoughts: z.number().min(1).max(10),
  hopefulness: z.number().min(1).max(10),
  lifeSatisfaction: z.number().min(1).max(10),
  motivation: z.number().min(1).max(10),
  lonelinessFrequency: z.number().min(1).max(10),
  physicalDrainFrequency: z.number().min(1).max(10),
  focusDifficulty: z.number().min(1).max(10),
  irritabilityFrequency: z.number().min(1).max(10),
  hobbyEnjoyment: z.number().min(1).max(10),
  supportFromLovedOnes: z.number().min(1).max(10),
  accomplishmentFrequency: z.number().min(1).max(10),
  selfEsteem: z.number().min(1).max(10),
});

// Availability Schema
export const availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 for Sunday-Saturday
  startTime: text("start_time").notNull(), // Format: "HH:MM" in 24h
  endTime: text("end_time").notNull(), // Format: "HH:MM" in 24h
  isAvailable: boolean("is_available").default(true),
});

export const insertAvailabilitySchema = createInsertSchema(availability).omit({
  id: true,
});

// Zoom Settings Schema
export const zoomSettings = pgTable("zoom_settings", {
  id: serial("id").primaryKey(),
  apiKey: text("api_key"),
  apiSecret: text("api_secret"),
  zoomEmail: text("zoom_email"),
});

export const insertZoomSettingsSchema = createInsertSchema(zoomSettings).omit({
  id: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Availability = typeof availability.$inferSelect;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;

export type ZoomSettings = typeof zoomSettings.$inferSelect;
export type InsertZoomSettings = z.infer<typeof insertZoomSettingsSchema>;

export type Questionnaire = z.infer<typeof questionnaireSchema>;
