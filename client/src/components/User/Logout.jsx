import React from "react";
import { logout } from "../../api";
import { useAuth } from "../Authenticate/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the backend logout API
      await logout();

      // Use the Auth context's logout to clear local token
      authLogout();

      // Navigate to home page
      navigate("/");

      alert("Logged out successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Logout failed";
      alert(errorMessage);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
