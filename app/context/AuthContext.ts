"use client";

import { createContext, useContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userData: {
    _id?: string;
    name?: string;
    email?: string;
  } | null;
  login: (loginData: { email: string; password: string }) => Promise<{
    status?: number;
    data?: {
      token?: string;
      user?: {
        _id?: string;
        name?: string;
        email?: string;
      };
    };
  }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;

// Custom hook for using Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
