import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`; 

export const register = async (username: string, password: string) => {
  try {
    const res = await axios.post(`${API_URL}/register`, { username, password });
    return res.data;
  } catch (error: any) {
    // Axios envía el mensaje de error en response.data
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message || "Error desconocido");
    }
  }
};

export const login = async (username: string, password: string) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { username, password });
    return res.data;
  } catch (error: any) {
     alert("Login inválido");
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message || "Error desconocido");
    }
  }
};