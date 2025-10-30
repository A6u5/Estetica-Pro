import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/appointments`;

export const getAppointments = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createAppointment = async (appointment: any) => {
  const res = await axios.post(API_URL, appointment);
  return res.data;
};

export const updateAppointment = async (id: number, updatedAppointment: any) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedAppointment);
  return res.data;
};

export const deleteAppointment = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export const getAppointmentsWithoutPayment = async () => {
  const res = await axios.get(`${API_URL}/appointmentsWithoutPayment`);
  return res.data;
};
