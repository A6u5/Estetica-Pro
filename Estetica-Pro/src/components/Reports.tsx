import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Download, DollarSign, Calendar, Users, BarChart3 } from 'lucide-react';

export default function Reports() {
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [popularServices, setPopularServices] = useState<any[]>([]);
  const [hourlyDistribution, setHourlyDistribution] = useState<any[]>([]);
  const [activeClients, setActiveClients] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reports');
        setMonthlyRevenue(res.data.monthlyRevenue);
        setPopularServices(res.data.popularServices);
        setHourlyDistribution(res.data.hourlyDistribution);

        const clientsRes = await axios.get('http://localhost:5000/api/reports/active-clients');
        setActiveClients(clientsRes.data.activeClients);
      } catch (error) {
        console.error("Error al obtener reportes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <p>Cargando reportes...</p>;

  // Calcular métricas auxiliares
  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1] || { revenue: 0, appointments: 0 };
  const previousMonth = monthlyRevenue[monthlyRevenue.length - 2] || { revenue: 0, appointments: 0 };
  const revenueGrowth = previousMonth.revenue
    ? (((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100).toFixed(1)
    : 0;
  const appointmentGrowth = previousMonth.appointments
    ? (((currentMonth.appointments - previousMonth.appointments) / previousMonth.appointments) * 100).toFixed(1)
    : 0;
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue || 0), 1);
  const maxAppointments = Math.max(...monthlyRevenue.map(m => m.appointments || 0), 1);
  const maxHourlyAppointments = Math.max(...hourlyDistribution.map(h => h.appointments || 0), 1);

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
          
          <Button variant="outline" onClick={async () => {
            try {
              const response = await fetch('http://localhost:5000/api/reports/export');
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'reporte_completo.xlsx';
              document.body.appendChild(a);
              a.click();
              a.remove();
            } catch (error) {
              console.error("Error al exportar reporte:", error);
            }
          }}>
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

        {/* --- Resumen --- */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Ingresos del mes */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ingresos del Mes</p>
                    <p className="text-2xl font-bold text-green-600">${currentMonth.revenue?.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{revenueGrowth}% vs mes anterior</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            {/* Turnos del mes */}
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

            {/* Ticket promedio */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ticket Promedio</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${currentMonth.appointments ? Math.round(currentMonth.revenue / currentMonth.appointments).toLocaleString() : 0}
                    </p>
                    <p className="text-xs text-purple-600">Por servicio</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            {/* Clientes activos (dinámico) */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Clientes Activos</p>
                    <p className="text-2xl font-bold text-orange-600">{activeClients}</p>
                    <p className="text-xs text-orange-600">
                      {activeClients > 0 ? 'Clientes con turnos este mes' : 'Sin actividad registrada'}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tendencia mensual */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Ingresos y Turnos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyRevenue.map((month, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium">{month.month}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Ingresos</span>
                        <span className="text-sm font-medium">${month.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(month.revenue / maxRevenue) * 100}%` }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Turnos</span>
                        <span className="text-sm font-medium">{month.appointments}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(month.appointments / maxAppointments) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Ingresos --- */}
        <TabsContent value="revenue" className="space-y-6">
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
                          <span className="text-xs text-primary-foreground">{hour.appointments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Servicios --- */}
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
                        <p className="text-sm text-muted-foreground">{service.count} servicios realizados</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${service.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">${service.avgprice} promedio</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Clientes --- */}
        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clientes Activos del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                Este mes hay <strong>{activeClients}</strong> cliente{activeClients !== 1 && 's'} con al menos un turno registrado.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}