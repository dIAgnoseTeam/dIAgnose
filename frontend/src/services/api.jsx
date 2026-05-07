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
  },
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
  },
);

export const authService = {
  getCurrentUser: () => api.get("/auth/me"),
  getRolById: (id) => api.get(`/roles/${id}`),
  logout: () => api.post("/auth/logout"),
  getProtectedData: () => api.get("/auth/protected"),
};

export const reviewService = {
  getAllReviews: (params = {}) => api.get("/reviews/", { params }),
  getStats: () => api.get("/reviews/stats"),
  createReview: (review) => api.post("/reviews/create", review),
};

export const datasetService = {
  getCase: () => api.get(`/cases/next`),
  getMaxRegisters: () => api.get("/cases/count"),
  getCaseById: (id) => api.get(`/cases/${id}`),
  deleteCase: (id) => api.delete(`/cases/${id}`),
  getAllCases: (params = {}) => api.get("/cases/", { params }),
};

export const userService = {
  getAllUsers: () => api.get("/users/"),
  updateUser: (userId, data) => api.put(`/users/${userId}`, data),
  changeUserRole: (userId, newRole) =>
    api.put(`/users/${userId}/role`, { id_rol: newRole }),
};

export const settingsService = {
  getSettings: () => api.get("/settings/"),
  updateSettings: (data) => api.patch("/settings/", data),
  setChatEnabled: (value) =>
    api.patch("/settings/chat", { chat_enabled: value }),
  getDashboard: () => api.get("/settings/dashboard"),
  getStatus: () => api.get("/settings/status"),
};

export const chatService = {
  getChatsByUser: (userId) => api.get(`/chats/user/${userId}`),
  createChat: (data) => api.post("/chats/", data),
  deleteChat: (chatId) => api.delete(`/chats/${chatId}`),
  updateChat: (chatId, data) => api.put(`/chats/${chatId}`, data),
  sendMessage: (chatId, message) =>
    api.post(`/chats/${chatId}/message`, { message }),
};

export const historicService = {
  getByChat: (chatId) => api.get(`/historics/chat/${chatId}`),
  create: (data) => api.post("/historics/", data),
};

export default api;
