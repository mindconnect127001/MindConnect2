import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { CalendarClock, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { saveQuestionnaireToLocalStorage } from "@/lib/appointment-utils";
import { Questionnaire, questionnaireSchema } from "@shared/schema";

// Extend the questionnaire schema with patient info fields
const patientInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  primaryReason: z.string().optional(),
  symptomsDuration: z.string().optional(),
  distressLevel: z.number().optional(),
  previousTreatment: z.string().optional(),
  medications: z.string().optional(),
  sleepQuality: z.string().optional(),
  dailyActivities: z.string().optional(),
  supportSystem: z.string().optional(),
  treatmentGoals: z.string().optional(),
  additionalInfo: z.string().optional(),
}).merge(questionnaireSchema);

type PatientInfoFormValues = z.infer<typeof patientInfoSchema>;

export default function PatientInfo() {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Initialize form with default values
  const form = useForm<PatientInfoFormValues>({
    resolver: zodResolver(patientInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      overallMood: 5,
      anxietyFrequency: 5,
      sleepAbility: 5,
      stressFrequency: 5,
      difficultyHandling: 5,
      overwhelmedFrequency: 5,
      sadnessFrequency: 5,
      connectionToOthers: 5,
      negativeThoughts: 5,
      hopefulness: 5,
      lifeSatisfaction: 5,
      motivation: 5,
      lonelinessFrequency: 5,
      physicalDrainFrequency: 5,
      focusDifficulty: 5,
      irritabilityFrequency: 5,
      hobbyEnjoyment: 5,
      supportFromLovedOnes: 5,
      accomplishmentFrequency: 5,
      selfEsteem: 5,
    },
  });

  // Load saved appointment details
  useEffect(() => {
    const savedDate = localStorage.getItem('appointment_date');
    const savedTime = localStorage.getItem('appointment_time');
    
    if (!savedDate || !savedTime) {
      // Redirect back to appointment scheduler if no date/time is saved
      setLocation('/appointment');
      return;
    }
    
    setSelectedDate(new Date(savedDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
    setSelectedTime(savedTime);
  }, [setLocation]);

  // Handle form submission
  const onSubmit = async (data: PatientInfoFormValues) => {
    try {
      // Extract questionnaire fields
      const { firstName, lastName, email, primaryReason, symptomsDuration, distressLevel, 
        previousTreatment, medications, sleepQuality, dailyActivities, supportSystem, 
        treatmentGoals, additionalInfo, ...questionnaireData } = data;
      
      // Save full name for appointment
      localStorage.setItem('patient_name', `${firstName} ${lastName}`);
      localStorage.setItem('patient_email', email);
      
      // Save questionnaire to localStorage
      saveQuestionnaireToLocalStorage(questionnaireData as Questionnaire);
      
      // Open the YouTube introduction video in a new tab
      window.open('https://youtu.be/TnqdDvFKBIc?si=Sl3vQGB3adf7ulgn', '_blank');
      
      // Navigate to confirmation page
      setLocation('/confirmation');
    } catch (error) {
      console.error('Error saving patient information:', error);
    }
  };

  // Navigate back to appointment scheduler
  const handleBack = () => {
    setLocation('/appointment');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:grid md:grid-cols-12 md:gap-8">
        {/* Left Column (Form) */}
        <div className="md:col-span-8 space-y-6">
          {/* Appointment Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-neutral-800">Patient Information</h2>
                
                {/* Step Indicator */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-neutral-200"></div>
                  </div>
                  <div className="relative flex justify-between">
                    <div className="flex items-center">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-medium">1</span>
                      <span className="ml-2 text-sm font-medium text-neutral-500">Select Date & Time</span>
                    </div>
                    <div className="flex items-center">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">2</span>
                      <span className="ml-2 text-sm font-medium text-neutral-700">Patient Information</span>
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
          
          {/* Patient Information Form */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-neutral-800 mb-4">Your Information</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="pt-2 border-t">
                    <h3 className="text-lg font-medium text-neutral-800 mb-4">Pre-Appointment Questionnaire</h3>
                    <p className="text-sm text-neutral-500 mb-6">
                      Please answer these questions to help us prepare for your appointment. Rate each question on a scale of 1-10, where 1 is negative and 10 is positive. Your responses will be saved locally and shared with your provider.
                    </p>
                    
                    <div className="bg-blue-50 p-4 rounded-md mb-6">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Note:</span> After submitting this form, you'll be directed to an introductory video from MindConnect about what to expect during your telehealth appointment.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="primaryReason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>1. What is the primary reason for your visit today?</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Please describe your symptoms or concerns" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="symptomsDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>2. How long have you been experiencing these symptoms?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="less_than_week">Less than a week</SelectItem>
                                <SelectItem value="1_2_weeks">1-2 weeks</SelectItem>
                                <SelectItem value="2_4_weeks">2-4 weeks</SelectItem>
                                <SelectItem value="1_3_months">1-3 months</SelectItem>
                                <SelectItem value="3_6_months">3-6 months</SelectItem>
                                <SelectItem value="more_than_6_months">More than 6 months</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="distressLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>3. Rate your current level of distress (1-10):</FormLabel>
                            <div className="flex space-x-1 justify-between">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                <Button
                                  key={value}
                                  type="button"
                                  variant={field.value === value ? "default" : "outline"}
                                  className="w-8 h-8 p-0 rounded-full"
                                  onClick={() => field.onChange(value)}
                                >
                                  {value}
                                </Button>
                              ))}
                            </div>
                            <div className="flex justify-between text-xs text-neutral-500 mt-1">
                              <span>Mild</span>
                              <span>Severe</span>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="previousTreatment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>4. Have you received previous treatment for this issue?</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Yes" id="previous_yes" />
                                  <FormLabel htmlFor="previous_yes" className="font-normal">Yes</FormLabel>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="No" id="previous_no" />
                                  <FormLabel htmlFor="previous_no" className="font-normal">No</FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="medications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>5. Are you currently taking any medications?</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Please list all medications" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="sleepQuality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>6. How would you rate your sleep quality?</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Good" id="sleep_good" />
                                  <FormLabel htmlFor="sleep_good" className="font-normal">Good</FormLabel>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Fair" id="sleep_fair" />
                                  <FormLabel htmlFor="sleep_fair" className="font-normal">Fair</FormLabel>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Poor" id="sleep_poor" />
                                  <FormLabel htmlFor="sleep_poor" className="font-normal">Poor</FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="dailyActivities"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>7. How are your symptoms affecting your daily activities?</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Please describe any impacts on work, relationships, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="supportSystem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>8. Do you have a support system (family, friends, etc.)?</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Please describe your support network" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="treatmentGoals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>9. What are your goals for treatment?</FormLabel>
                            <FormControl>
                              <Textarea placeholder="What would you like to achieve through our services?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>10. Is there anything else you'd like us to know before your appointment?</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Any additional information that might be helpful" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={handleBack} className="flex items-center">
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit" className="flex items-center bg-gradient-to-r from-primary to-blue-600">
                      Submit & Watch Intro Video
                      <Video className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column (Appointment Summary) */}
        <div className="md:col-span-4 mt-8 md:mt-0">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-neutral-800 mb-4">Appointment Summary</h3>
              
              {selectedDate && selectedTime && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CalendarClock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-neutral-800">Date & Time</h4>
                      <p className="text-neutral-600">{selectedDate}</p>
                      <p className="text-neutral-600">{selectedTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-neutral-800">Appointment Type</h4>
                      <p className="text-neutral-600">Initial Consultation (45 minutes)</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md mt-4">
                    <p className="text-sm text-blue-700">
                      Your responses to the questionnaire will be saved locally and shared with your provider during your appointment to ensure you receive the best care possible.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
