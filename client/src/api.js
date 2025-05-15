import axios from "axios";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance
const API = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the Authorization header
API.interceptors.request.use(
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

// User-related API functions
export const verifyEmail = async (data) => {
  return await API.post("/api/user/verify-email", data);
};

export const signup = async (userData) => {
  return await API.post("/api/user/signup", userData);
};

export const forgotPassword = async (data) => {
  return await API.post("/api/user/forgot-password", data);
};

export const resetPassword = async (data) => {
  return await API.post("/api/user/reset-password", data);
};

export const login = async (userData) => {
  return await API.post("/api/user/login", userData);
};

export const logout = async () => {
  return await API.post("/api/user/logout");
};

export const verify = async () => {
  return await API.get("/api/user/verify");
};

// Product-related API functions
export const searchProduct = async (url) => {
  return await API.post("/api/product", { url });
};

// Alerts-related API functions
export const addAlert = async (data) => {
  return await API.post("/api/alerts", data);
};

export const getAlerts = async () => {
  return await API.get("/api/alerts/get");
};

export const deleteAlert = async (alertId) => {
  return await API.delete(`/api/alerts/remove/${alertId}`);
};
