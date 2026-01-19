import axios from "axios";

import { API_BASE } from "../config/constants";


const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptamos para añadir el token de auth para las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptores para manjear errores de auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  getCurrentUser: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  getProtectedData: () => api.get("/auth/protected"),
};

export default api;
