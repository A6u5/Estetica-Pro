import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/clients`;

export const getClients = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addClient = async (newClient: any) => {
  const res = await axios.post(API_URL, newClient);
  return res.data;
};

export const updateClient = async (id: number, updatedClient: any) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedClient);
  return res.data;
};