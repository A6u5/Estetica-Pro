import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  Package,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react';

// Mock data
const todayStats = {
  revenue: 2850,
  appointments: 8,
  clients: 6,
  lowStock: 3
};

const todayAppointments = [
  { id: 1, time: '09:00', client: 'María González', service: 'Limpieza facial', status: 'confirmado' },
  { id: 2, time: '10:30', client: 'Ana Rodríguez', service: 'Manicure', status: 'en_progreso' },
  { id: 3, time: '12:00', client: 'Carlos López', service: 'Masaje relajante', status: 'pendiente' },
  { id: 4, time: '14:00', client: 'Sofia Martín', service: 'Depilación', status: 'pendiente' },
  { id: 5, time: '16:30', client: 'Laura Pérez', service: 'Tratamiento capilar', status: 'pendiente' },
];

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

export function Dashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'en_progreso': return 'bg-blue-100 text-blue-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado': return 'Confirmado';
      case 'en_progreso': return 'En progreso';
      case 'pendiente': return 'Pendiente';
      default: return status;
    }
  };

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
            <div className="text-2xl font-bold">${todayStats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% vs ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnos de Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.appointments}</div>
            <p className="text-xs text-muted-foreground">
              5 completados, 3 pendientes
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
                      <span className="font-medium">{appointment.time}</span>
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusText(appointment.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{appointment.client}</p>
                    <p className="text-sm">{appointment.service}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
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