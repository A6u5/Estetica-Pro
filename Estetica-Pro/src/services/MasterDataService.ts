import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/masterData`;

export const getServices = async () => {
  const res = await axios.get(`${API_URL}/services`);
  return res.data;
};
export const getStatus = async () => {
  const res = await axios.get(`${API_URL}/status`);
  return res.data;
};