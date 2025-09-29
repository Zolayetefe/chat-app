// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { User, LoginCredentials, RegisterCredentials } from "../types/auth";
import { login, register, logout, getStoredUser, refresh } from "../services/authService";

type AuthContextType = {
  user: User | null;
  loginUser: (credentials: LoginCredentials) => Promise<void>;
  registerUser: (credentials: RegisterCredentials) => Promise<void>;
  logoutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user + try refreshing access token on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const loginUser = async (credentials: LoginCredentials) => {
    try {
      const data = await login(credentials);
      setUser(data.user);
    } catch (err: any) {
      setUser(null);
      toast.error(err.message || "Login failed");
    }
  };

  const registerUser = async (credentials: RegisterCredentials) => {
    try {
      const data = await register(credentials);
      setUser(data.user);
    } catch (err: any) {
      setUser(null);
      toast.error(err.message || "Registration failed");
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy usage
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
