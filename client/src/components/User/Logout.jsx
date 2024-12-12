import React from "react";
import { logout } from "../../api";

const Logout = () => {
  const handleLogout = async () => {
    try {
      await logout();
      alert("Logged out successfully");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
