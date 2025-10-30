import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Search, DollarSign, CreditCard, User, Calendar, Filter, Download, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import { formatDate, formatDateISO } from '../helpers/AppointmentComponentHelper';
import { getPaymentMethods, getPaymentStatus } from '../services/MasterDataService';
import { createPayment, deletePayment, exportPaymentsToExcel, getAllPayments, updatePayment } from '../services/PaymentService'
import { getAppointments, getAppointmentsWithoutPayment } from '../services/AppointmentService';
import { formatDateString, getStatusColor, paymentMethodsToShow, pendingAmount, todayRevenue, totalRevenue } from '../helpers/PaymentComponentHelper';

export function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null);

  useEffect(() => {
    fetchPaymentMethods();
    fetchPaymentStatus();
    fetchAllAppointments();
    fetchAppointments();
    fetchPayments();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const res = await getPaymentMethods();
      setPaymentMethods(res);
    } catch (error) {
      console.error('Error al traer los métodos de pago:', error);
    }
  };
  const fetchPaymentStatus = async () => {
    try {
      const res = await getPaymentStatus();
      setPaymentStatus(res);
    } catch (error) {
      console.error('Error al traer los estados del pago:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await getAppointmentsWithoutPayment();
      setAppointments(res);
    } catch (error) {
      console.error('Error al traer los turnos:', error);
    }
  };

  const fetchAllAppointments = async () => {
    try {
      const res = await getAppointments();
      setAllAppointments(res);
    } catch (error) {
      console.error('Error al traer los turnos:', error);
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

  const handleAddPayment = async (newPayment: any) => {
    try {
      const res = await createPayment(newPayment);
      setPayments(prev => [...prev, res.payment]);
    } catch (err) {
      console.error('Error al registrar pago:', err);
    }
  };

  const handleUpdatePayment = async (id: number, updatedPayment: any) => {
    try {
      const res = await updatePayment(id, updatedPayment);
      setPayments(
        payments.map((c) => (c.id === id ? res : c))
      );
    } catch (err) {
      console.error('Error al actualizar pago:', err);
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    try {
      await deletePayment(paymentId);
      setPayments(prev => prev.filter(a => a.id !== paymentId));
    } catch (err) {
      console.error('Error al eliminar pago:', err);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.service_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.payment_status_id === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.payment_method_id === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const PaymentForm = ({ payment, onClose, onSave }: { payment?: any, onClose: () => void,onSave: (data: any) => void; }) => {
    
    const [formData, setFormData] = useState({
      appointment_id: payment?.appointment_id || '',
      payment_method_id: payment?.payment_method_id || '',
      payment_status_id: payment?.payment_status_id || 1,
      amount: payment?.amount || 0,
      payment_date: payment?.payment_date ? formatDateISO(new Date(payment.payment_date)) : ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value, type } = e.target;
      setFormData(prev => ({...prev,
        [id]: type === "number" ? Number(value) : value
      }));
    };

    const handleSelectChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
      if (payment) onSave({ ...formData, id: payment.id });
      else onSave(formData);
      onClose();
    };
    
    return(
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
            <Label htmlFor="service">Turno</Label>
            <Select value={formData.appointment_id}
            disabled={!!payment}
            onValueChange={(value:any) => handleSelectChange("appointment_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar turno" />
              </SelectTrigger>
              <SelectContent>
                {(payment? allAppointments : appointments).map(appointment => (
                  <SelectItem key={appointment.id} value={appointment.id}>
                    <b>Cliente:</b> {appointment.client.name} - <b>Servicio:</b> {appointment.service.name} - <b>Fecha:</b>Fecha: {formatDateString(appointment.appointment_date)} {appointment.appointment_time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Monto</Label>
          <Input 
            id="amount" 
            type="number"
            placeholder="0"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="method">Método de pago</Label>
          <Select value={formData.payment_method_id}
          onValueChange={(value: any) => handleSelectChange("payment_method_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar método" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map(method => (
                <SelectItem key={method.id} value={method.id}>
                  {method.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Estado</Label>
          <Select value={formData.payment_status_id ? formData.payment_status_id : 1}
          onValueChange={(value: any) => handleSelectChange("payment_status_id", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentStatus.map(status => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="payment_date">Fecha</Label>
          <Input 
            id="payment_date" 
            type="date"
            value={formData.payment_date}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {payment ? 'Actualizar' : 'Registrar'} Pago
        </Button>
      </div>
    </div>
  );
  }
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-600">${totalRevenue(payments).toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos de Hoy</p>
                <p className="text-2xl font-bold text-blue-600">${todayRevenue(payments).toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pagos Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">${pendingAmount(payments).toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestión de Pagos</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline"
              onClick={() => exportPaymentsToExcel(payments)}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="buttonAdd">
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Pago
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Registrar Nuevo Pago</DialogTitle>
                  </DialogHeader>
                  <PaymentForm 
                  onClose={() => setIsAddDialogOpen(false)} 
                  onSave={handleAddPayment}/>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por cliente o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {paymentStatus.map(status => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los métodos</SelectItem>
                {paymentMethods.map(method => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payments Table */}
          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{payment.client_name}</span>
                      <Badge className={getStatusColor(payment.payment_status)}>
                        {payment.payment_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{payment.service_name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateString(payment.payment_date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        {payment.payment_method}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    ${payment.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    #{payment.id.toString().padStart(4, '0')}
                  </div>
                  <div className="flex gap-2">
                    <Button
                    variant="outline" size="sm"
                    onClick={() => setSelectedPayment(payment)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm"
                    onClick={() => handleDeletePayment(payment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron pagos con los filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen por Método de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethodsToShow.map((method) => {
              const methodPayments = payments.filter(
                (p) => method.ids.includes(p.payment_method.toLowerCase()) && p.payment_status === 'Pagado'
              );
              
              const methodTotal = methodPayments.reduce((sum, p) => sum + Number(p.amount), 0);
              const methodCount = methodPayments.length;
              const Icon = method.icon;

              return (
                <Card key={method.name}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <Badge variant="secondary">{methodCount} pagos</Badge>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{method.name}</p>
                    <p className="text-lg font-bold">${methodTotal.toLocaleString()}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Appointment Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Pago</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <PaymentForm 
              onSave={(data) => handleUpdatePayment(data.id, data)}
              payment={selectedPayment} 
              onClose={() => setSelectedPayment(null)} 
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}