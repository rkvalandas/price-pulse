import React, { createContext, useContext, useState, useEffect } from "react";
import { login, logout, verify } from "../../api"; // Import API functions

// Create Context
const AuthContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check login status on app load
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await verify();
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false);
      }
    };
  
    checkLoginStatus();
  }, []);
  

  // Login handler
  const handleLogin = async (userData) => {
    try {
      const response = await login(userData); // Call the login API
      if (response.status === 200) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout(); // Call the logout API
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using Auth Context
export const useAuth = () => useContext(AuthContext);
