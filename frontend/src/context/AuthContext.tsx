import React, { createContext, useContext, useState, useEffect } from "react";
import  type{ User, LoginCredentials, RegisterCredentials } from "../types/auth";
import { login, register, logout, getStoredUser, refresh } from "../services/authService";

type AuthContextType = {
  user: User | null;
  loginUser: (credentials: LoginCredentials) => Promise<void>;
  registerUser: (credentials: RegisterCredentials) => Promise<void>;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      refresh(); // get a fresh access token when app loads
    }

    // refresh access token periodically (every 14 min for 15 min expiry example)
    const interval = setInterval(() => {
      refresh();
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const loginUser = async (credentials: LoginCredentials) => {
    const { user } = await login(credentials);
    setUser(user);
  };

  const registerUser = async (credentials: RegisterCredentials) => {
    const { user } = await register(credentials);
    setUser(user);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
