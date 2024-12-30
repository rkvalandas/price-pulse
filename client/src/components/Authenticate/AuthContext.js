import React from "react";
import { useContext } from "react";

const AuthContext = React.createContext();

export default AuthContext;

// Custom hook for using Auth Context
export const useAuth = () => useContext(AuthContext);