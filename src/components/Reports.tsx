import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Download, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  BarChart3,
  Star,
  Clock
} from 'lucide-react';

// Mock data for reports
const monthlyRevenue = [
  { month: 'Ene', revenue: 45000, appointments: 120 },
  { month: 'Feb', revenue: 52000, appointments: 140 },
  { month: 'Mar', revenue: 48000, appointments: 128 },
  { month: 'Abr', revenue: 58000, appointments: 155 },
  { month: 'May', revenue: 62000, appointments: 168 },
  { month: 'Jun', revenue: 55000, appointments: 148 },
];

const popularServices = [
  { name: 'Limpieza facial', count: 45, revenue: 36000, avgPrice: 800 },
  { name: 'Manicure', count: 38, revenue: 22800, avgPrice: 600 },
  { name: 'Masaje relajante', count: 32, revenue: 38400, avgPrice: 1200 },
  { name: 'Depilación', count: 28, revenue: 25200, avgPrice: 900 },
  { name: 'Tratamiento capilar', count: 24, revenue: 36000, avgPrice: 1500 },
  { name: 'Pedicure', count: 22, revenue: 15400, avgPrice: 700 },
];

const clientMetrics = [
  { metric: 'Clientes totales', value: 156, change: '+12%', icon: Users },
  { metric: 'Clientes nuevos (mes)', value: 18, change: '+25%', icon: TrendingUp },
  { metric: 'Clientes recurrentes', value: 89, change: '+8%', icon: Star },
  { metric: 'Promedio visitas/cliente', value: 3.2, change: '+5%', icon: Calendar },
];

const hourlyDistribution = [
  { hour: '9:00', appointments: 12 },
  { hour: '10:00', appointments: 18 },
  { hour: '11:00', appointments: 22 },
  { hour: '12:00', appointments: 15 },
  { hour: '13:00', appointments: 8 },
  { hour: '14:00', appointments: 25 },
  { hour: '15:00', appointments: 30 },
  { hour: '16:00', appointments: 28 },
  { hour: '17:00', appointments: 20 },
  { hour: '18:00', appointments: 16 },
];

const topClients = [
  { name: 'María González', totalSpent: 4500, visits: 8, lastVisit: '2024-01-25' },
  { name: 'Ana Rodríguez', totalSpent: 3200, visits: 6, lastVisit: '2024-01-24' },
  { name: 'Carlos López', totalSpent: 2800, visits: 5, lastVisit: '2024-01-23' },
  { name: 'Sofia Martín', totalSpent: 2600, visits: 4, lastVisit: '2024-01-22' },
  { name: 'Laura Pérez', totalSpent: 2400, visits: 4, lastVisit: '2024-01-21' },
];

export function Reports() {
  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const previousMonth = monthlyRevenue[monthlyRevenue.length - 2];
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);
  const appointmentGrowth = ((currentMonth.appointments - previousMonth.appointments) / previousMonth.appointments * 100).toFixed(1);

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));
  const maxAppointments = Math.max(...monthlyRevenue.map(m => m.appointments));
  const maxHourlyAppointments = Math.max(...hourlyDistribution.map(h => h.appointments));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reportes y Análisis</h2>
          <p className="text-muted-foreground">Análisis detallado del rendimiento del negocio</p>
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Último mes</SelectItem>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="1year">Último año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ingresos del Mes</p>
                    <p className="text-2xl font-bold text-green-600">${currentMonth.revenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{revenueGrowth}% vs mes anterior</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Turnos del Mes</p>
                    <p className="text-2xl font-bold text-blue-600">{currentMonth.appointments}</p>
                    <p className="text-xs text-blue-600">+{appointmentGrowth}% vs mes anterior</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ticket Promedio</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${Math.round(currentMonth.revenue / currentMonth.appointments).toLocaleString()}
                    </p>
                    <p className="text-xs text-purple-600">Por servicio</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Clientes Activos</p>
                    <p className="text-2xl font-bold text-orange-600">156</p>
                    <p className="text-xs text-orange-600">+12% este mes</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Ingresos y Turnos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyRevenue.map((month, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium">{month.month}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Ingresos</span>
                        <span className="text-sm font-medium">${month.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(month.revenue / maxRevenue) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Turnos</span>
                        <span className="text-sm font-medium">{month.appointments}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(month.appointments / maxAppointments) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyRevenue.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{month.month} 2024</p>
                        <p className="text-sm text-muted-foreground">{month.appointments} turnos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${month.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          ${Math.round(month.revenue / month.appointments)} promedio
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Horarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hourlyDistribution.map((hour, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-16 text-sm font-medium">{hour.hour}</div>
                      <div className="flex-1">
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className="bg-primary h-3 rounded-full flex items-center justify-end pr-1"
                            style={{ width: `${(hour.appointments / maxHourlyAppointments) * 100}%` }}
                          >
                            <span className="text-xs text-primary-foreground">
                              {hour.appointments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Servicios Más Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.count} servicios realizados
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${service.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">${service.avgPrice} promedio</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {clientMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-green-600">{metric.change}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{metric.metric}</p>
                    <p className="text-xl font-bold">{metric.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Clientes por Gasto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.visits} visitas • Última: {new Date(client.lastVisit).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${client.totalSpent.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        ${Math.round(client.totalSpent / client.visits)} promedio
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}