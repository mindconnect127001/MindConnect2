import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ClipboardList, Calendar, User, MoreHorizontal, Edit, Trash2, X, Eye } from "lucide-react";
import { format } from "date-fns";

interface AdminAppointmentsProps {
  appointments: Appointment[];
  isLoading: boolean;
  filterDate?: Date;
}

export default function AdminAppointments({ appointments, isLoading, filterDate }: AdminAppointmentsProps) {
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [viewAppointment, setViewAppointment] = useState<Appointment | null>(null);
  const [editAppointment, setEditAppointment] = useState<Appointment | null>(null);
  const [deleteAppointment, setDeleteAppointment] = useState<Appointment | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Filter appointments by date if needed
  useEffect(() => {
    if (!appointments) {
      setFilteredAppointments([]);
      return;
    }
    
    if (filterDate) {
      const dateStr = filterDate.toISOString().split('T')[0];
      const filtered = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.toISOString().split('T')[0] === dateStr;
      });
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [appointments, filterDate]);

  // Delete appointment mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/appointments/${id}`, undefined);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been successfully cancelled.",
      });
      setDeleteAppointment(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to cancel the appointment. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting appointment:", error);
    }
  });

  // Handle appointment cancellation
  const handleDeleteAppointment = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let color;
    switch (status.toLowerCase()) {
      case 'confirmed':
        color = "bg-green-100 text-green-800";
        break;
      case 'pending':
        color = "bg-yellow-100 text-yellow-800";
        break;
      case 'cancelled':
        color = "bg-red-100 text-red-800";
        break;
      default:
        color = "bg-neutral-100 text-neutral-800";
    }
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${color}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Appointment type badge component
  const TypeBadge = ({ type }: { type: string }) => {
    let color;
    if (type.toLowerCase().includes('initial')) {
      color = "bg-primary-100 text-primary-800";
    } else if (type.toLowerCase().includes('follow')) {
      color = "bg-blue-100 text-blue-800";
    } else {
      color = "bg-neutral-100 text-neutral-800";
    }
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${color}`}>
        {type}
      </span>
    );
  };

  // Format date for display
  const formatAppointmentDate = (date: string | Date) => {
    const appointmentDate = new Date(date);
    return format(appointmentDate, "MMM d, yyyy");
  };

  // Format time for display
  const formatAppointmentTime = (date: string | Date) => {
    const appointmentDate = new Date(date);
    return format(appointmentDate, "h:mm a");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse flex space-x-4 justify-center mb-4">
          <div className="rounded-full bg-neutral-200 h-12 w-12"></div>
        </div>
        <p className="text-neutral-500">Loading appointments...</p>
      </div>
    );
  }

  // Empty state
  if (filteredAppointments.length === 0) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="mx-auto h-12 w-12 text-neutral-400" />
        <h3 className="mt-2 text-lg font-medium text-neutral-900">No appointments found</h3>
        <p className="mt-1 text-sm text-neutral-500">
          {filterDate ? 'No appointments scheduled for the selected date.' : 'No appointments have been scheduled yet.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto shadow-sm border border-neutral-200 rounded-lg">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Patient</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date & Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 font-medium">
                      {appointment.patientName.split(' ').map(name => name[0]).join('').toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-800">{appointment.patientName}</div>
                      <div className="text-sm text-neutral-500">{appointment.patientEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-800">{formatAppointmentDate(appointment.date)}</div>
                  <div className="text-sm text-neutral-500">{formatAppointmentTime(appointment.date)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TypeBadge type={appointment.type} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={appointment.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 space-x-2">
                  <Button variant="ghost" size="sm" className="text-primary" onClick={() => setViewAppointment(appointment)}>
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => setEditAppointment(appointment)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteAppointment(appointment)}>
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Appointment Dialog */}
      <Dialog open={!!viewAppointment} onOpenChange={(open) => !open && setViewAppointment(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View detailed information about this appointment.
            </DialogDescription>
          </DialogHeader>

          {viewAppointment && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-2">Patient Information</h3>
                  <Card className="p-4">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 font-medium mr-4">
                        {viewAppointment.patientName.split(' ').map(name => name[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800">{viewAppointment.patientName}</p>
                        <p className="text-sm text-neutral-500">{viewAppointment.patientEmail}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-2">Appointment Details</h3>
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-primary mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-neutral-800">Date & Time</p>
                          <p className="text-sm text-neutral-500">
                            {formatAppointmentDate(viewAppointment.date)} at {formatAppointmentTime(viewAppointment.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-primary mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-neutral-800">Appointment Type</p>
                          <p className="text-sm text-neutral-500">{viewAppointment.type}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-500 mb-2">Zoom Meeting Information</h3>
                <Card className="p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-neutral-800">Meeting Link</p>
                      <a 
                        href={viewAppointment.zoomMeetingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-primary hover:underline break-all"
                      >
                        {viewAppointment.zoomMeetingUrl || "No meeting link available"}
                      </a>
                    </div>
                    {viewAppointment.zoomMeetingPassword && (
                      <div>
                        <p className="font-medium text-neutral-800">Meeting Password</p>
                        <p className="text-sm text-neutral-500">{viewAppointment.zoomMeetingPassword}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {viewAppointment.questionnaire && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-2">Patient Questionnaire</h3>
                  <Card className="p-4">
                    <div className="space-y-4">
                      {Object.entries(viewAppointment.questionnaire).map(([key, value]) => (
                        <div key={key}>
                          <p className="font-medium text-neutral-800">{formatQuestionLabel(key)}</p>
                          <p className="text-sm text-neutral-500 mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewAppointment(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Appointment Dialog */}
      <Dialog open={!!deleteAppointment} onOpenChange={(open) => !open && setDeleteAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center">
              <X className="mr-2 h-5 w-5" /> Cancel Appointment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteAppointment && (
            <div className="bg-neutral-50 p-4 rounded-md my-4">
              <p className="font-medium">Appointment Details</p>
              <p className="text-sm text-neutral-500">
                {deleteAppointment.patientName} - {formatAppointmentDate(deleteAppointment.date)} at {formatAppointmentTime(deleteAppointment.date)}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAppointment(null)}>Keep Appointment</Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteAppointment && handleDeleteAppointment(deleteAppointment.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Cancelling..." : "Cancel Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to format questionnaire keys into readable labels
function formatQuestionLabel(key: string): string {
  switch (key) {
    case 'primaryReason':
      return 'What is the primary reason for your visit?';
    case 'symptomsDuration':
      return 'How long have you been experiencing these symptoms?';
    case 'distressLevel':
      return 'Current distress level (1-10)';
    case 'previousTreatment':
      return 'Have you received previous treatment for this issue?';
    case 'medications':
      return 'Current medications';
    case 'sleepQuality':
      return 'Sleep quality';
    case 'dailyActivities':
      return 'How symptoms affect daily activities';
    case 'supportSystem':
      return 'Support system';
    case 'treatmentGoals':
      return 'Treatment goals';
    case 'additionalInfo':
      return 'Additional information';
    default:
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
}
