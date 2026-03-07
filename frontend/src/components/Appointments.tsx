import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { getServices, getStatus } from '../services/MasterDataService';
import { getClients } from '../services/ClientService';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from "../services/AppointmentService";
import { Plus, Calendar, Clock, User, Phone, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { getStatusColor, getStatusText, formatDate, formatDateISO, getWeekDates, timeSlots} from '../helpers/AppointmentComponentHelper';

export function Appointments() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedView, setSelectedView] = useState<'day' | 'week'>('day');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null);
  const [currentDayAppointments, setCurrentDayAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [clientsData, setClientsData] = useState<any[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    fetchServices();
    fetchClients();
    fetchStatus();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await getServices();
      setServices(res);
    } catch (error) {
      console.error('Error al traer los servicios:', error);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await getStatus();
      setStatuses(res);
    } catch (error) {
      console.error('Error al traer los estados:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await getClients();
      setClientsData(res);
    } catch (err) {
      console.error('Error al obtener clientes:', err);
    }
  };

  useEffect(() => {
    if (appointments.length === 0) return;
    const currentDateStr = formatDateISO(currentDate);

    const todayAppointments = appointments.filter(a => {
      const appointmentDateStr = new Date(a.appointment_date)
        .toISOString()
        .split("T")[0];
      return appointmentDateStr === currentDateStr;
    });
    setCurrentDayAppointments(todayAppointments);
  }, [appointments, currentDate]); 

  const fetchAppointments = async () => {
    try {
      const res = await getAppointments();
      setAppointments(res);
    } catch (err) {
      console.error('Error al obtener turnos:', err);
    }
  };

  const handleAddAppointment = async (newAppointment: any) => {
    try {
      const res = await createAppointment(newAppointment);
      setAppointments(prev => [...prev, res]);
    } catch (err) {
      console.error('Error al agregar turno:', err);
    }
  };

  const handleUpdateAppointment = async (id: number, updatedAppointment: any) => {
      try {
        const res = await updateAppointment(id, updatedAppointment);
        setAppointments(
          appointments.map((c) => (c.id === id ? res : c))
        );
      } catch (err) {
        console.error('Error al actualizar turno:', err);
      }
    };

  const handleDeleteAppointment = async (appointmentId: number) => {
    try {
      await deleteAppointment(appointmentId); 
      setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    } catch (err) {
      console.error('Error al eliminar turno:', err);
    }
  };

  const AppointmentForm = ({ appointment, onClose, onSave }: { appointment?: any, onClose: () => void, onSave: (data: any) => void; }) => {
    const [selectedService, setSelectedService] = useState<string>(appointment?.service?.name || '');
    const [selectedServiceData, setSelectedServiceData] = useState<typeof services[0] | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<number | ''>('');
    const [selectedClient, setSelectedClient] = useState<number | ''>(appointment?.client?.id || '');
    const [selectedClientData, setSelectedClientData] = useState<any>(appointment?.client || null);
  
    useEffect(() => {
      setSelectedStatus(appointment?.status ? appointment.status.id : statuses[1].id);
    }, [])

    const handleServiceChange = (serviceName: string) => {
      setSelectedService(serviceName);
      const serviceData = services.find(s => s.name === serviceName);
      setSelectedServiceData(serviceData || null);
      setFormData(prev => ({ ...prev, service_id: serviceData.id }))
    };

    const handleStatusChange = (statusId: number) => {
      setSelectedStatus(statusId);
      setFormData(prev => ({ ...prev, status_id: statusId }))
    };

    const handleClientChange = (clientId: number) => {
      setSelectedClient(clientId);
      const clientData = clientsData.find(s => s.id === clientId);
      setSelectedClientData(clientData || null);
      setFormData(prev => ({ ...prev, client_id: clientId }))
    };

    const [formData, setFormData] = useState({
      client_id: appointment?.client?.id || '',
      service_id: appointment?.service?.id || '',
      status_id: appointment?.status?.id || 2,
      appointment_date: appointment ? formatDateISO(new Date(appointment.appointment_date)) : '',
      appointment_time: appointment?.appointment_time || '',
      professional: appointment?.professional || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = () => {
      if (appointment) onSave({ ...formData, id: appointment.id });
      else onSave(formData);
      onClose();
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="service">Cliente</Label>
            <Select value={selectedClient} onValueChange={handleClientChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientsData.map(client => (
                  <SelectItem key={client.name} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="clientPhone">Teléfono</Label>
            <Input 
              id="clientPhone" 
              readOnly
              placeholder="+54 11 1234-5678"
              defaultValue={selectedClientData?.phone}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="appointment_date">Fecha</Label>
            <Input 
              id="appointment_date" 
              type="date"
              value={formData.appointment_date} onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="appointment_time">Hora</Label>
            <Select 
            value={appointment?.appointment_time?.slice(0,5) || formData.appointment_time}
            onValueChange={(val) => setFormData(prev => ({ ...prev, appointment_time: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar hora" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(appointment_time => (
                  <SelectItem key={appointment_time} value={appointment_time}>{appointment_time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Estado</Label>
            <Select 
            value={selectedStatus}
            onValueChange={(val) => handleStatusChange(Number(val))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="professional">Profesional asignado</Label>
            <Input 
              id="professional" 
              placeholder="Nombre del profesional asignado"
              value={formData.professional} onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="service">Servicio</Label>
            <Select value={selectedService} onValueChange={handleServiceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar servicio" />
              </SelectTrigger>
              <SelectContent>
                {services.map(service => (
                  <SelectItem key={service.name} value={service.name}>
                    {service.name} - {service.duration}min - ${service.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedServiceData && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Duración:</strong> {selectedServiceData.duration} minutos | 
              <strong> Precio:</strong> ${selectedServiceData.price}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {appointment ? 'Actualizar' : 'Agendar'} Turno
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() - (selectedView === 'day' ? 1 : 7));
                setCurrentDate(newDate);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h2 className="text-lg font-semibold min-w-[300px] text-center">
              {selectedView === 'day' ? formatDate(currentDate) : `Semana del ${formatDate(getWeekDates(currentDate)[0])}`}
            </h2>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() + (selectedView === 'day' ? 1 : 7));
                setCurrentDate(newDate);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
          >
            Hoy
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as 'day' | 'week')}>
            <TabsList>
              <TabsTrigger value="day">Día</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="buttonAdd">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Turno
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agendar Nuevo Turno</DialogTitle>
              </DialogHeader>
              <AppointmentForm 
              onClose={() => setIsAddDialogOpen(false)} 
              onSave={handleAddAppointment}/>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar View */}
      {selectedView === 'day' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Turnos del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentDayAppointments.length > 0 ? (
                currentDayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">{appointment.appointment_time}</div>
                        {/* <div className="text-xs text-muted-foreground">{appointment.service.duration}min</div> */}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{appointment.client.name}</span>
                          <Badge className={getStatusColor(appointment.status.name)}>
                            {getStatusText(appointment.status.name)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{appointment.service.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {appointment.client.phone}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          {/* ${appointment.service.price.toLocaleString()} */}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay turnos agendados para este día</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-7 gap-4">
          {getWeekDates(currentDate).map((date, index) => {
            const dateStr = formatDateISO(date);
            const dayAppointments = appointments.filter(apt => formatDateISO(new Date(apt.appointment_date)) === dateStr);
            
            return (
              <Card key={index} className="min-h-[300px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-center">
                    {date.toLocaleDateString('es-AR', { weekday: 'short' })}
                    <br />
                    {date.getDate()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-1">
                  {dayAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="p-2 text-xs bg-primary/10 rounded cursor-pointer hover:bg-primary/20"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <div className="font-medium">{appointment.appointment_time}</div>
                      <div className="truncate">{appointment.client.name}</div>
                      <div className="text-muted-foreground truncate">{appointment.service.name}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Appointment Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Turno</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <AppointmentForm 
              onSave={(data) => handleUpdateAppointment(data.id, data)}
              appointment={selectedAppointment} 
              onClose={() => setSelectedAppointment(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}