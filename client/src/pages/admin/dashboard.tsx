import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminAppointments from "./appointments";
import { useToast } from "@/hooks/use-toast";
import { Filter, Download, Settings, CalendarRange, Users, Video, LogOut } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get all appointments
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['/api/appointments'],
    queryFn: async () => {
      const response = await fetch('/api/appointments', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      return response.json();
    },
  });
  
  const handleLogout = () => {
    // Clear the authentication token
    sessionStorage.removeItem("admin_authenticated");
    
    // Show success message
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin dashboard",
    });
    
    // Navigate to login page
    navigate("/admin/login");
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">MindConnect Admin Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-500">Total Appointments</p>
                <h3 className="text-3xl font-bold text-neutral-900 mt-1">
                  {isLoading ? "..." : appointments?.length || 0}
                </h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <CalendarRange className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-500">Total Patients</p>
                <h3 className="text-3xl font-bold text-neutral-900 mt-1">
                  {isLoading ? "..." : "0"}
                </h3>
              </div>
              <div className="p-2 bg-violet-100 rounded-full">
                <Users className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-neutral-500">Upcoming Sessions</p>
                <h3 className="text-3xl font-bold text-neutral-900 mt-1">
                  {isLoading ? "..." : appointments?.filter((apt: any) => new Date(apt.date) > new Date()).length || 0}
                </h3>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Video className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Admin Tabs */}
      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList className="bg-neutral-100">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="provider-schedule">Provider Schedule</TabsTrigger>
          <TabsTrigger value="zoom-settings">Zoom Settings</TabsTrigger>
          <TabsTrigger value="patient-records">Patient Records</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 mb-4">
                <h2 className="text-lg font-medium text-neutral-800">Appointment Management</h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <DatePicker 
                    date={selectedDate} 
                    onDateChange={setSelectedDate} 
                  />
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Input 
                  placeholder="Search appointments..."
                  className="max-w-sm mb-4"
                />
                
                <AdminAppointments 
                  filterDate={selectedDate}
                  appointments={appointments || []}
                  isLoading={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="provider-schedule">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-neutral-800 mb-4">Provider Schedule</h2>
              <p className="text-neutral-500">Configure your availability and working hours.</p>
              
              <div className="mt-4 p-6 bg-neutral-50 rounded-md text-center">
                <h3 className="text-neutral-600 font-medium">Provider Schedule Management</h3>
                <p className="text-sm text-neutral-500 mt-2">This feature will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="zoom-settings">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-neutral-800 mb-4">Zoom Integration Settings</h2>
              <p className="text-neutral-500 mb-6">Configure your Zoom account settings for telehealth appointments.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Zoom API Key</label>
                  <Input placeholder="Enter your Zoom API Key" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Zoom API Secret</label>
                  <Input type="password" placeholder="Enter your Zoom API Secret" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Zoom Account Email</label>
                  <Input placeholder="Enter your Zoom account email" />
                </div>
                <div className="pt-4">
                  <Button>Save Zoom Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patient-records">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-neutral-800 mb-4">Patient Records</h2>
              <p className="text-neutral-500">View and manage patient information and questionnaire responses.</p>
              
              <div className="mt-4 p-6 bg-neutral-50 rounded-md text-center">
                <h3 className="text-neutral-600 font-medium">Patient Record Management</h3>
                <p className="text-sm text-neutral-500 mt-2">This feature will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
