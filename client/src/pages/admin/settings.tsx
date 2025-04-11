import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { insertZoomSettingsSchema } from "@shared/schema";
import { Save, RefreshCw, Video, Clock, CalendarClock } from "lucide-react";

// Enhanced schema for form validation
const zoomSettingsSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  apiSecret: z.string().min(1, "API Secret is required"),
  zoomEmail: z.string().email("Please enter a valid email address"),
});

// Schema for availability settings
const availabilitySchema = z.object({
  mondayEnabled: z.boolean().default(true),
  mondayStart: z.string().default("09:00"),
  mondayEnd: z.string().default("17:00"),
  
  tuesdayEnabled: z.boolean().default(true),
  tuesdayStart: z.string().default("09:00"),
  tuesdayEnd: z.string().default("17:00"),
  
  wednesdayEnabled: z.boolean().default(true),
  wednesdayStart: z.string().default("09:00"),
  wednesdayEnd: z.string().default("17:00"),
  
  thursdayEnabled: z.boolean().default(true),
  thursdayStart: z.string().default("09:00"),
  thursdayEnd: z.string().default("17:00"),
  
  fridayEnabled: z.boolean().default(true),
  fridayStart: z.string().default("09:00"),
  fridayEnd: z.string().default("17:00"),
  
  saturdayEnabled: z.boolean().default(false),
  saturdayStart: z.string().default("09:00"),
  saturdayEnd: z.string().default("17:00"),
  
  sundayEnabled: z.boolean().default(false),
  sundayStart: z.string().default("09:00"),
  sundayEnd: z.string().default("17:00"),
});

// Schema for email template settings
const emailTemplateSchema = z.object({
  confirmationSubject: z.string().min(1, "Subject is required"),
  confirmationTemplate: z.string().min(1, "Email template is required"),
  reminderSubject: z.string().min(1, "Subject is required"),
  reminderTemplate: z.string().min(1, "Email template is required"),
});

type ZoomSettingsForm = z.infer<typeof zoomSettingsSchema>;
type AvailabilityForm = z.infer<typeof availabilitySchema>;
type EmailTemplateForm = z.infer<typeof emailTemplateSchema>;

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get Zoom settings
  const { data: zoomSettings, isLoading: isLoadingZoom } = useQuery({
    queryKey: ['/api/zoom-settings'],
    queryFn: async () => {
      const response = await fetch('/api/zoom-settings', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch Zoom settings');
      }
      
      return response.json();
    },
  });
  
  // Zoom settings form
  const zoomForm = useForm<ZoomSettingsForm>({
    resolver: zodResolver(zoomSettingsSchema),
    defaultValues: {
      apiKey: "",
      apiSecret: "",
      zoomEmail: "",
    }
  });
  
  // Update form values when data is loaded
  useState(() => {
    if (zoomSettings) {
      zoomForm.setValue('apiKey', zoomSettings.apiKey || "");
      zoomForm.setValue('apiSecret', zoomSettings.apiSecret || "");
      zoomForm.setValue('zoomEmail', zoomSettings.zoomEmail || "");
    }
  });
  
  // Save Zoom settings mutation
  const saveZoomSettingsMutation = useMutation({
    mutationFn: async (data: ZoomSettingsForm) => {
      const response = await apiRequest('POST', '/api/zoom-settings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/zoom-settings'] });
      toast({
        title: "Zoom Settings Saved",
        description: "Your Zoom integration settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save Zoom settings. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving Zoom settings:", error);
    }
  });
  
  // Handle Zoom settings form submission
  const onSubmitZoomSettings = (data: ZoomSettingsForm) => {
    saveZoomSettingsMutation.mutate(data);
  };
  
  // Availability form
  const availabilityForm = useForm<AvailabilityForm>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      mondayEnabled: true,
      mondayStart: "09:00",
      mondayEnd: "17:00",
      
      tuesdayEnabled: true,
      tuesdayStart: "09:00",
      tuesdayEnd: "17:00",
      
      wednesdayEnabled: true,
      wednesdayStart: "09:00",
      wednesdayEnd: "17:00",
      
      thursdayEnabled: true,
      thursdayStart: "09:00",
      thursdayEnd: "17:00",
      
      fridayEnabled: true,
      fridayStart: "09:00",
      fridayEnd: "17:00",
      
      saturdayEnabled: false,
      saturdayStart: "09:00",
      saturdayEnd: "17:00",
      
      sundayEnabled: false,
      sundayStart: "09:00",
      sundayEnd: "17:00",
    }
  });
  
  // Email templates form
  const emailTemplateForm = useForm<EmailTemplateForm>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      confirmationSubject: "MindConnect: Your Appointment Confirmation",
      confirmationTemplate: `Hello {{patientName}},

Thank you for scheduling an appointment with MindConnect. 

Appointment Details:
- Date: {{appointmentDate}}
- Time: {{appointmentTime}}
- Type: {{appointmentType}}

To join your appointment, please use the following Zoom link:
{{zoomLink}}

Password: {{zoomPassword}}

If you need to reschedule or cancel, please contact us or visit our website.

Best regards,
The MindConnect Team`,
      
      reminderSubject: "MindConnect: Appointment Reminder",
      reminderTemplate: `Hello {{patientName}},

This is a reminder about your upcoming appointment with MindConnect.

Your appointment is scheduled for {{appointmentDate}} at {{appointmentTime}}.

To join your appointment, please use the following Zoom link:
{{zoomLink}}

Password: {{zoomPassword}}

We look forward to seeing you soon!

Best regards,
The MindConnect Team`,
    }
  });
  
  // Handle availability form submission
  const onSubmitAvailability = (data: AvailabilityForm) => {
    // This would be connected to the API in a real implementation
    console.log("Availability settings:", data);
    toast({
      title: "Availability Settings Saved",
      description: "Your availability settings have been updated successfully.",
    });
  };
  
  // Handle email templates form submission
  const onSubmitEmailTemplates = (data: EmailTemplateForm) => {
    // This would be connected to the API in a real implementation
    console.log("Email templates:", data);
    toast({
      title: "Email Templates Saved",
      description: "Your email templates have been updated successfully.",
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Settings</h1>
      </div>
      
      <Tabs defaultValue="zoom" className="space-y-6">
        <TabsList>
          <TabsTrigger value="zoom" className="flex items-center">
            <Video className="mr-2 h-4 w-4" />
            Zoom Integration
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Email Templates
          </TabsTrigger>
        </TabsList>
        
        {/* Zoom Settings Tab */}
        <TabsContent value="zoom">
          <Card>
            <CardHeader>
              <CardTitle>Zoom Integration Settings</CardTitle>
              <CardDescription>
                Configure your Zoom account settings to enable automatic meeting creation for telehealth appointments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...zoomForm}>
                <form onSubmit={zoomForm.handleSubmit(onSubmitZoomSettings)} className="space-y-6">
                  <FormField
                    control={zoomForm.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zoom API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your Zoom API Key" {...field} />
                        </FormControl>
                        <FormDescription>
                          You can find your API Key in the Zoom Developer Portal.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={zoomForm.control}
                    name="apiSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zoom API Secret</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your Zoom API Secret" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your API Secret is used to authenticate with the Zoom API.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={zoomForm.control}
                    name="zoomEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zoom Account Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your Zoom account email" {...field} />
                        </FormControl>
                        <FormDescription>
                          The email address associated with your Zoom account.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="flex items-center"
                    disabled={saveZoomSettingsMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {saveZoomSettingsMutation.isPending ? "Saving..." : "Save Zoom Settings"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Availability Settings Tab */}
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Provider Availability</CardTitle>
              <CardDescription>
                Configure your working hours and available days for appointments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...availabilityForm}>
                <form onSubmit={availabilityForm.handleSubmit(onSubmitAvailability)} className="space-y-6">
                  {/* Monday */}
                  <div className="border p-4 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Monday</h3>
                      <FormField
                        control={availabilityForm.control}
                        name="mondayEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Available</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={availabilityForm.control}
                        name="mondayStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={availabilityForm.control}
                        name="mondayEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Tuesday */}
                  <div className="border p-4 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Tuesday</h3>
                      <FormField
                        control={availabilityForm.control}
                        name="tuesdayEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Available</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={availabilityForm.control}
                        name="tuesdayStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={availabilityForm.control}
                        name="tuesdayEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Wednesday */}
                  <div className="border p-4 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Wednesday</h3>
                      <FormField
                        control={availabilityForm.control}
                        name="wednesdayEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Available</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={availabilityForm.control}
                        name="wednesdayStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={availabilityForm.control}
                        name="wednesdayEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Thursday */}
                  <div className="border p-4 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Thursday</h3>
                      <FormField
                        control={availabilityForm.control}
                        name="thursdayEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Available</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={availabilityForm.control}
                        name="thursdayStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={availabilityForm.control}
                        name="thursdayEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Friday */}
                  <div className="border p-4 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Friday</h3>
                      <FormField
                        control={availabilityForm.control}
                        name="fridayEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Available</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={availabilityForm.control}
                        name="fridayStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={availabilityForm.control}
                        name="fridayEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Weekend (collapsible) */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium">Weekend Availability</h3>
                    
                    {/* Saturday */}
                    <div className="border p-4 rounded-md">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Saturday</h3>
                        <FormField
                          control={availabilityForm.control}
                          name="saturdayEnabled"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Switch 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                />
                              </FormControl>
                              <FormLabel className="!mt-0">Available</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={availabilityForm.control}
                          name="saturdayStart"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={availabilityForm.control}
                          name="saturdayEnd"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    {/* Sunday */}
                    <div className="border p-4 rounded-md">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Sunday</h3>
                        <FormField
                          control={availabilityForm.control}
                          name="sundayEnabled"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Switch 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                />
                              </FormControl>
                              <FormLabel className="!mt-0">Available</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={availabilityForm.control}
                          name="sundayStart"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={availabilityForm.control}
                          name="sundayEnd"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save Availability Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Email Templates Tab */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Customize the email templates used for appointment notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailTemplateForm}>
                <form onSubmit={emailTemplateForm.handleSubmit(onSubmitEmailTemplates)} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-medium">Appointment Confirmation Email</h3>
                    
                    <FormField
                      control={emailTemplateForm.control}
                      name="confirmationSubject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Subject</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailTemplateForm.control}
                      name="confirmationTemplate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Template</FormLabel>
                          <FormControl>
                            <Textarea rows={10} {...field} />
                          </FormControl>
                          <FormDescription>
                            Use variables like {{patientName}}, {{appointmentDate}}, {{appointmentTime}}, {{appointmentType}}, 
                            {{zoomLink}}, and {{zoomPassword}} in your template.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">Appointment Reminder Email</h3>
                    
                    <FormField
                      control={emailTemplateForm.control}
                      name="reminderSubject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Subject</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailTemplateForm.control}
                      name="reminderTemplate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Template</FormLabel>
                          <FormControl>
                            <Textarea rows={10} {...field} />
                          </FormControl>
                          <FormDescription>
                            Use variables like {{patientName}}, {{appointmentDate}}, {{appointmentTime}}, {{appointmentType}}, 
                            {{zoomLink}}, and {{zoomPassword}} in your template.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save Email Templates
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
