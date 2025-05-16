"use client";

import React, { useState, useEffect } from "react";
import { login as loginAPI, logout as logoutAPI, verify } from "../api";
import AuthContext from "./AuthContext";

interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth Provider
function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Check login status on app load
  useEffect(() => {
    const checkLoginStatus = async () => {
      // Check if token exists in localStorage
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        try {
          const response = await verify();
          if (response.data.isAuthenticated) {
            setIsAuthenticated(true);
            // Store user data if available in the response
            if (response.data.user) {
              setUserData(response.data.user);
            }
          } else {
            // Token is invalid or expired
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setUserData(null);
          }
        } catch (error) {
          console.error("Error checking authentication status:", error);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUserData(null);
        }
      }
    };

    checkLoginStatus();
  }, []);

  // Login handler
  // Define interfaces for type safety
  interface LoginData {
    email: string;
    password: string;
    rememberMe?: boolean; // Optional rememberMe parameter
  }

  // Define the return type for the login function
  type LoginReturnType = {
    status?: number;
    data?: {
      token?: string;
      user?: {
        _id?: string;
        name?: string;
        email?: string;
      };
    };
  };

  interface UserData {
    _id: string;
    name: string;
    email: string;
  }

  const handleLogin = async (
    loginData: LoginData
  ): Promise<LoginReturnType> => {
    try {
      const response = await loginAPI(loginData); // Call the login API

      if (response.status === 200) {
        // Store the token in localStorage
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }

        // Store user data (assuming the structure returned from API)
        if (response.data?.user) {
          setUserData({
            _id: response.data.user._id,
            name: response.data.user.name,
            email: response.data.user.email,
          });
        }

        setIsAuthenticated(true);

        return {
          status: response.status,
          data: {
            token: response.data?.token,
            user: response.data?.user,
          },
        }; // Return the formatted response for components to use
      }
      return { status: response.status };
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Re-throw error for components to handle
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutAPI(); // Call the logout API
      // Remove token from localStorage
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUserData(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userData,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
