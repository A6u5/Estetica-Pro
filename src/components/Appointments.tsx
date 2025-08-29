import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  Calendar, 
  Clock, 
  User,
  Phone,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2
} from 'lucide-react';

// Mock data
const appointments = [
  {
    id: 1,
    date: '2024-01-27',
    time: '09:00',
    clientName: 'María González',
    clientPhone: '+54 11 1234-5678',
    service: 'Limpieza facial',
    duration: 60,
    price: 800,
    status: 'confirmado'
  },
  {
    id: 2,
    date: '2024-01-27',
    time: '10:30',
    clientName: 'Ana Rodríguez',
    clientPhone: '+54 11 2345-6789',
    service: 'Manicure',
    duration: 45,
    price: 600,
    status: 'en_progreso'
  },
  {
    id: 3,
    date: '2024-01-27',
    time: '12:00',
    clientName: 'Carlos López',
    clientPhone: '+54 11 3456-7890',
    service: 'Masaje relajante',
    duration: 90,
    price: 1200,
    status: 'pendiente'
  },
  {
    id: 4,
    date: '2024-01-28',
    time: '14:00',
    clientName: 'Sofia Martín',
    clientPhone: '+54 11 4567-8901',
    service: 'Depilación',
    duration: 120,
    price: 900,
    status: 'pendiente'
  },
  {
    id: 5,
    date: '2024-01-28',
    time: '16:30',
    clientName: 'Laura Pérez',
    clientPhone: '+54 11 5678-9012',
    service: 'Tratamiento capilar',
    duration: 90,
    price: 1500,
    status: 'pendiente'
  },
];

const services = [
  { name: 'Limpieza facial', duration: 60, price: 800 },
  { name: 'Manicure', duration: 45, price: 600 },
  { name: 'Pedicure', duration: 60, price: 700 },
  { name: 'Masaje relajante', duration: 90, price: 1200 },
  { name: 'Masaje deportivo', duration: 90, price: 1400 },
  { name: 'Depilación', duration: 120, price: 900 },
  { name: 'Tratamiento capilar', duration: 90, price: 1500 },
  { name: 'Tratamiento facial', duration: 75, price: 1000 },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30'
];

export function Appointments() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'day' | 'week'>('day');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDateISO = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'en_progreso': return 'bg-blue-100 text-blue-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado': return 'Confirmado';
      case 'en_progreso': return 'En progreso';
      case 'pendiente': return 'Pendiente';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getCurrentDayAppointments = () => {
    const currentDateStr = formatDateISO(currentDate);
    return appointments.filter(apt => apt.date === currentDateStr);
  };

  const getWeekDates = () => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    start.setDate(diff);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const getWeekAppointments = () => {
    const weekDates = getWeekDates();
    const weekStart = formatDateISO(weekDates[0]);
    const weekEnd = formatDateISO(weekDates[6]);
    
    return appointments.filter(apt => apt.date >= weekStart && apt.date <= weekEnd);
  };

  const AppointmentForm = ({ appointment, onClose }: { appointment?: typeof appointments[0], onClose: () => void }) => {
    const [selectedService, setSelectedService] = useState(appointment?.service || '');
    const [selectedServiceData, setSelectedServiceData] = useState<typeof services[0] | null>(null);

    const handleServiceChange = (serviceName: string) => {
      setSelectedService(serviceName);
      const serviceData = services.find(s => s.name === serviceName);
      setSelectedServiceData(serviceData || null);
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientName">Cliente</Label>
            <Input 
              id="clientName" 
              placeholder="Nombre del cliente"
              defaultValue={appointment?.clientName}
            />
          </div>
          <div>
            <Label htmlFor="clientPhone">Teléfono</Label>
            <Input 
              id="clientPhone" 
              placeholder="+54 11 1234-5678"
              defaultValue={appointment?.clientPhone}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="date">Fecha</Label>
            <Input 
              id="date" 
              type="date"
              defaultValue={appointment?.date || formatDateISO(currentDate)}
            />
          </div>
          <div>
            <Label htmlFor="time">Hora</Label>
            <Select defaultValue={appointment?.time}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar hora" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(time => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Estado</Label>
            <Select defaultValue={appointment?.status || 'pendiente'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="en_progreso">En progreso</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          <Button onClick={onClose}>
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
              {selectedView === 'day' ? formatDate(currentDate) : `Semana del ${formatDate(getWeekDates()[0])}`}
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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Turno
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agendar Nuevo Turno</DialogTitle>
              </DialogHeader>
              <AppointmentForm onClose={() => setIsAddDialogOpen(false)} />
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
              {getCurrentDayAppointments().length > 0 ? (
                getCurrentDayAppointments().map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">{appointment.time}</div>
                        <div className="text-xs text-muted-foreground">{appointment.duration}min</div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{appointment.clientName}</span>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{appointment.service}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {appointment.clientPhone}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          ${appointment.price.toLocaleString()}
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
                      <Button variant="outline" size="sm">
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
          {getWeekDates().map((date, index) => {
            const dateStr = formatDateISO(date);
            const dayAppointments = appointments.filter(apt => apt.date === dateStr);
            
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
                      <div className="font-medium">{appointment.time}</div>
                      <div className="truncate">{appointment.clientName}</div>
                      <div className="text-muted-foreground truncate">{appointment.service}</div>
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
              appointment={selectedAppointment} 
              onClose={() => setSelectedAppointment(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}