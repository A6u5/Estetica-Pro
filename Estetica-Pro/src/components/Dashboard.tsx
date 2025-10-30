import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DollarSign, Users, Calendar, Package, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { getStatusColor, getStatusText, formatDateISO } from '../helpers/AppointmentComponentHelper';
import { getAppointments } from "../services/AppointmentService";
import { useEffect, useState } from 'react';
import { getAllPayments } from '../services/PaymentService';
import { revenueChangeVsYesterday, todayRevenue } from '../helpers/PaymentComponentHelper';

// Mock data
const todayStats = {
  revenue: 2850,
  appointments: 8,
  clients: 6,
  lowStock: 3
};

const lowStockItems = [
  { name: 'Crema hidratante', current: 2, minimum: 5 },
  { name: 'Aceite esencial', current: 1, minimum: 3 },
  { name: 'Toallas desechables', current: 15, minimum: 20 },
];

const weeklyRevenue = [
  { day: 'Lun', amount: 1200 },
  { day: 'Mar', amount: 1800 },
  { day: 'Mié', amount: 2200 },
  { day: 'Jue', amount: 1600 },
  { day: 'Vie', amount: 2850 },
  { day: 'Sáb', amount: 3200 },
  { day: 'Dom', amount: 900 },
];

export function Dashboard({ onViewChange }: { onViewChange: (view: string) => void }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [todayAppointmentsCountBytatus, setTodayAppointmentsCountBytatus] = useState<any>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const { change } = revenueChangeVsYesterday(payments);
  
  useEffect(() => {
    fetchAppointments();
    fetchPayments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await getAppointments();
      setAppointments(res);
    } catch (err) {
      console.error('Error al obtener turnos:', err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await getAllPayments();
      setPayments(res);
    } catch (err) {
      console.error('Error al obtener pagos:', err);
    }
  };

  useEffect(() => {
    if (appointments.length === 0) return;
    const today = new Date();
    const currentDateStr = formatDateISO(today);

    const todayAppointments = appointments.filter(a => {
      const appointmentDateStr = new Date(a.appointment_date)
        .toISOString()
        .split("T")[0];
      return appointmentDateStr === currentDateStr;
    });
    setTodayAppointments(todayAppointments);
    countAppointmentsByStatus();    
  }, [appointments]); 

  const countAppointmentsByStatus = () => {
    const counts = { completed: 0, pending: 0 };

    todayAppointments.forEach((apt) => {
      if (apt.status?.name === 'Confirmado' || apt.status?.name === 'Completado') {
        counts.completed += 1;
      } else if (apt.status?.name === 'Pendiente') {
        counts.pending += 1;
      }
    });

    setTodayAppointmentsCountBytatus(counts);
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos de Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayRevenue(payments).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +{change}% vs ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnos de Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayAppointmentsCountBytatus.completed} completados, {todayAppointmentsCountBytatus.pending} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.clients}</div>
            <p className="text-xs text-muted-foreground">
              2 clientes nuevos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{todayStats.lowStock}</div>
            <p className="text-xs text-muted-foreground">
              Productos requieren reposición
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Turnos de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{appointment.appointment_time}</span>
                      <Badge className={getStatusColor(appointment.status.name)}>
                        {getStatusText(appointment.status.name)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{appointment.client.name}</p>
                    <p className="text-sm">{appointment.service.name}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => onViewChange("appointments")}>
              Ver todos los turnos
            </Button>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock actual: {item.current} | Mínimo: {item.minimum}
                    </p>
                  </div>
                  <Button size="sm" variant="destructive">
                    Reabastecer
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver inventario completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos de la Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-64 gap-2">
            {weeklyRevenue.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-primary rounded-t-sm w-full transition-all hover:bg-primary/80"
                  style={{ 
                    height: `${(day.amount / Math.max(...weeklyRevenue.map(d => d.amount))) * 200}px`,
                    minHeight: '20px'
                  }}
                />
                <div className="mt-2 text-center">
                  <p className="text-xs text-muted-foreground">{day.day}</p>
                  <p className="text-sm font-medium">${day.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}