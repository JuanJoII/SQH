import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // tu backend en Docker
  timeout: 10000,
});

// Interceptor: añade el token a TODAS las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;