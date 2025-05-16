"use client";

import axios from "axios";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Create axios instance
const API = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the Authorization header
if (typeof window !== "undefined") {
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
}

// User-related API functions
export const verifyEmail = async (data) => {
  try {
    return await API.post("/api/user/verify-email", data);
  } catch (error) {
    console.error("Error in verifyEmail API call:", error);
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    return await API.post("/api/user/signup", userData);
  } catch (error) {
    console.error("Error in signup API call:", error);
    throw error;
  }
};

export const resendVerification = async (data) => {
  try {
    return await API.post("/api/user/resend-verification", data);
  } catch (error) {
    console.error("Error in resendVerification API call:", error);
    throw error;
  }
};

export const forgotPassword = async (data) => {
  try {
    return await API.post("/api/user/forgot-password", data);
  } catch (error) {
    console.error("Error in forgotPassword API call:", error);
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    return await API.post("/api/user/reset-password", data);
  } catch (error) {
    console.error("Error in resetPassword API call:", error);
    throw error;
  }
};

export const login = async (userData) => {
  try {
    return await API.post("/api/user/login", userData);
  } catch (error) {
    console.error("Error in login API call:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    return await API.post("/api/user/logout");
  } catch (error) {
    console.error("Error in logout API call:", error);
    throw error;
  }
};

export const verify = async () => {
  try {
    return await API.get("/api/user/verify");
  } catch (error) {
    console.error("Error in verify API call:", error);
    throw error;
  }
};

// Product-related API functions
export const searchProduct = async (url) => {
  try {
    const response = await API.post("/api/product", { url });
    console.log("API response:", response);
    return response;
  } catch (error) {
    console.error("Error in searchProduct API call:", error);
    throw error;
  }
};

// Alerts-related API functions
export const addAlert = async (data) => {
  try {
    return await API.post("/api/alerts", data);
  } catch (error) {
    console.error("Error in addAlert API call:", error);
    throw error;
  }
};

export const getAlerts = async () => {
  try {
    return await API.get("/api/alerts/get");
  } catch (error) {
    console.error("Error in getAlerts API call:", error);
    throw error;
  }
};

export const deleteAlert = async (alertId) => {
  try {
    return await API.delete(`/api/alerts/remove/${alertId}`);
  } catch (error) {
    console.error("Error in deleteAlert API call:", error);
    throw error;
  }
};
