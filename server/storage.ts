import { 
  users, type User, type InsertUser,
  appointments, type Appointment, type InsertAppointment,
  availability, type Availability, type InsertAvailability,
  zoomSettings, type ZoomSettings, type InsertZoomSettings
} from "@shared/schema";

// Storage interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Appointment operations
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByUser(userId: number): Promise<Appointment[]>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Availability operations
  getAvailability(): Promise<Availability[]>;
  getAvailabilityByDay(dayOfWeek: number): Promise<Availability[]>;
  createAvailability(availability: InsertAvailability): Promise<Availability>;
  updateAvailability(id: number, availability: Partial<InsertAvailability>): Promise<Availability | undefined>;
  deleteAvailability(id: number): Promise<boolean>;
  
  // Zoom settings operations
  getZoomSettings(): Promise<ZoomSettings | undefined>;
  updateZoomSettings(settings: InsertZoomSettings): Promise<ZoomSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private appointments: Map<number, Appointment>;
  private availabilitySlots: Map<number, Availability>;
  private zoomConfig: ZoomSettings | undefined;
  
  private userIdCounter: number;
  private appointmentIdCounter: number;
  private availabilityIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.appointments = new Map();
    this.availabilitySlots = new Map();
    
    this.userIdCounter = 1;
    this.appointmentIdCounter = 1;
    this.availabilityIdCounter = 1;
    
    // Initialize with some default availability
    this.initializeDefaultAvailability();
  }
  
  private initializeDefaultAvailability() {
    const defaultHours = [
      { start: "09:00", end: "17:00" }
    ];
    
    // Add availability for Monday-Friday (1-5)
    for (let day = 1; day <= 5; day++) {
      defaultHours.forEach(hours => {
        this.createAvailability({
          dayOfWeek: day,
          startTime: hours.start,
          endTime: hours.end,
          isAvailable: true
        });
      });
    }
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Appointment methods
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }
  
  async getAppointmentsByUser(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      appointment => appointment.userId === userId
    );
  }
  
  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const dateString = date.toISOString().split('T')[0];
    return Array.from(this.appointments.values()).filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toISOString().split('T')[0] === dateString;
    });
  }
  
  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });
  }
  
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentIdCounter++;
    const appointment: Appointment = { ...insertAppointment, id };
    this.appointments.set(id, appointment);
    return appointment;
  }
  
  async updateAppointment(id: number, appointmentUpdate: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const existingAppointment = this.appointments.get(id);
    if (!existingAppointment) {
      return undefined;
    }
    
    const updatedAppointment = { ...existingAppointment, ...appointmentUpdate };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
  
  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }
  
  // Availability methods
  async getAvailability(): Promise<Availability[]> {
    return Array.from(this.availabilitySlots.values());
  }
  
  async getAvailabilityByDay(dayOfWeek: number): Promise<Availability[]> {
    return Array.from(this.availabilitySlots.values()).filter(
      availability => availability.dayOfWeek === dayOfWeek
    );
  }
  
  async createAvailability(insertAvailability: InsertAvailability): Promise<Availability> {
    const id = this.availabilityIdCounter++;
    const availability: Availability = { ...insertAvailability, id };
    this.availabilitySlots.set(id, availability);
    return availability;
  }
  
  async updateAvailability(id: number, availabilityUpdate: Partial<InsertAvailability>): Promise<Availability | undefined> {
    const existingAvailability = this.availabilitySlots.get(id);
    if (!existingAvailability) {
      return undefined;
    }
    
    const updatedAvailability = { ...existingAvailability, ...availabilityUpdate };
    this.availabilitySlots.set(id, updatedAvailability);
    return updatedAvailability;
  }
  
  async deleteAvailability(id: number): Promise<boolean> {
    return this.availabilitySlots.delete(id);
  }
  
  // Zoom settings methods
  async getZoomSettings(): Promise<ZoomSettings | undefined> {
    return this.zoomConfig;
  }
  
  async updateZoomSettings(settings: InsertZoomSettings): Promise<ZoomSettings> {
    if (this.zoomConfig) {
      this.zoomConfig = { ...this.zoomConfig, ...settings };
    } else {
      this.zoomConfig = { id: 1, ...settings };
    }
    return this.zoomConfig;
  }
}

export const storage = new MemStorage();
