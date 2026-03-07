import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDateISO } from "../helpers/AppointmentComponentHelper";

const API_URL = import.meta.env.VITE_API_URL;

// Crear un pago
export const createPayment = async (paymentData: {
  appointment_id: number;
  payment_method_id: number;
  payment_status_id: number;
  amount: number;
  payment_date: string;
}) => {
  try {
    const res = await axios.post(`${API_URL}/payments`, paymentData);
    return res.data;
  } catch (error: any) {
    console.error("Error creando el pago:", error);
    throw error.response?.data || error;
  }
};

// Obtener todos los pagos
export const getAllPayments = async () => {
  try {
    const res = await axios.get(`${API_URL}/payments`);
    return res.data;
  } catch (error: any) {
    console.error("Error obteniendo los pagos:", error);
    throw error.response?.data || error;
  }
};

// Actualizar un pago
export const updatePayment = async (
  id: number,
  paymentData: {
    payment_method_id?: number;
    payment_status_id?: number;
    amount?: number;
    payment_date?: string;
  }
) => {
  try {
    const res = await axios.put(`${API_URL}/payments/${id}`, paymentData);
    return res.data;
  } catch (error: any) {
    console.error("Error actualizando el pago:", error);
    throw error.response?.data || error;
  }
};

// Eliminar un pago
export const deletePayment = async (id: number) => {
  try {
    const res = await axios.delete(`${API_URL}/payments/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Error eliminando el pago:", error);
    throw error.response?.data || error;
  }
};

export const exportPaymentsToExcel = (payments: any[]) => {
  const data = payments.map(p => ({
    "Cliente": p.client_name || "",
    "Servicio": p.service_name || "",
    "Fecha": formatDateISO(new Date(p.payment_date)) || "",
    "Método": p.payment_method || "",
    "Estado": p.payment_status || "",
    "Monto": Number(p.amount).toLocaleString("es-AR", { style: "currency", currency: "ARS" }),
    "N° Pago": p.id
  }));

  // hoja
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pagos");

  // Exportar archivo
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `Pagos_${new Date().toLocaleDateString("es-AR")}.xlsx`);
};

