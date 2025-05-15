import React, { useState, useEffect } from "react";
import { login, logout, verify } from "../../api"; // Import API functions
import AuthContext from "./AuthContext";

// Auth Provider
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  // Check login status on app load
  useEffect(() => {
    const checkLoginStatus = async () => {
      // Check if token exists in localStorage
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
    };

    checkLoginStatus();
  }, []);

  // Login handler
  const handleLogin = async (loginData) => {
    try {
      const response = await login(loginData); // Call the login API
      if (response.status === 200) {
        // Store the token in localStorage
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        // Store user data
        setUserData({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
        });

        setIsAuthenticated(true);
        return response; // Return the response for components to use
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Re-throw error for components to handle
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout(); // Call the logout API
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
