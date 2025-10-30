import { CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { formatDate, formatDateISO } from "./AppointmentComponentHelper";

export const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pagado': return 'bg-green-100 text-green-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Señado': return 'bg-orange-600 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};

export const formatDateString = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
};

export const totalRevenue = (payments: any) => {
    return payments
    .filter(p => p.payment_status === 'Pagado')
    .reduce((sum, p) => sum + Number(p.amount), 0);
} 

export const pendingAmount = (payments: any) => {
    return payments
    .filter(p => p.payment_status === 'Pendiente')
    .reduce((sum, p) => sum + Number(p.amount), 0);
} 

export const todayRevenue = (payments: any) => {
    return payments
    .filter(p => formatDate(new Date(p.payment_date)) === formatDate(new Date())
      && (p.payment_status === 'Pagado' || p.payment_status === 'Señado'))
    .reduce((sum, p) => sum + Number(p.amount), 0);
}

export const revenueChangeVsYesterday = (payments: any) => {
  const yesterday = formatDate(
    new Date(new Date().setDate(new Date().getDate() - 1))
  );

  const todayRevenueTotal = todayRevenue(payments)

  const yesterdayRevenue = payments
    .filter((p) => formatDate(new Date(p.payment_date)) === yesterday &&
      (p.payment_status === "Pagado" || p.payment_status === "Señado"))
    .reduce((sum, p) => sum + Number(p.amount), 0);

  let change = 0;
  if (yesterdayRevenue > 0) {
    const diff = ((todayRevenueTotal - yesterdayRevenue) / yesterdayRevenue) * 100;
    change = Math.min(Math.max(diff, 0), 100); // limita entre 0 y 100
  } 
  else if (todayRevenueTotal > 0) change = 100;

  return {
    todayRevenue,
    yesterdayRevenue,
    change,
  };
};


export const paymentMethodsToShow = [
  { ids: ['efectivo'], name: 'Efectivo', icon: DollarSign },
  { ids: ['tarjeta de crédito', 'tarjeta de débito'], name: 'Tarjeta de Crédito/Débito', icon: CreditCard },
  { ids: ['transferencia bancaria', 'mercado pago'], name: 'Transferencia Bancaria/ Mercado Pago', icon: TrendingUp },
];