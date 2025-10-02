// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { User, LoginCredentials, RegisterCredentials } from "../types/auth";
import { login, register, logout, getStoredUser, refresh } from "../services/authService";

type AuthContextType = {
  user: User | null;
  isLoading: boolean; // ⬅️ ADDED
  loginUser: (credentials: LoginCredentials) => Promise<void>;
  registerUser: (credentials: RegisterCredentials) => Promise<void>;
  logoutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // 1. Initialize loading state to TRUE
  const [isLoading, setLoading] = useState(true); 

  // Load user (This runs on every app start/refresh)
  useEffect(() => {
    const loadUser = async () => {
        try {
            const storedUser = getStoredUser();
            console.log("User from auth context", storedUser);
            
            if (storedUser) {
                // If a stored user exists, try to refresh the token or validate the session
                // For simplicity here, we'll assume getStoredUser is enough,
                // but in a real app, you'd likely call an API here.
                // If 'refresh' is an API call that validates the session:
                // await refresh(); 
                setUser(storedUser);
            }
        } catch (error) {
            // Handle error if token is expired/invalid during the refresh check
            console.error("Session refresh failed:", error);
            setUser(null);
        } finally {
            // 2. Set loading to FALSE ONLY after the check is complete
            setLoading(false);
        }
    };
    
    loadUser();
  }, []); // Empty dependency array means this runs once on mount

  const loginUser = async (credentials: LoginCredentials) => {
    try {
      setLoading(true); // Set loading true during login
      const data = await login(credentials);
      setUser(data.user);
    } catch (err: any) {
      setUser(null);
      toast.error(err.message || "Login failed");
    } finally {
        setLoading(false); // Set loading false afterward
    }
  };

  const registerUser = async (credentials: RegisterCredentials) => {
    try {
      setLoading(true); // Set loading true during registration
      const data = await register(credentials);
      setUser(data.user);
      toast.success("Registration successful!");
    } catch (err: any) {
      setUser(null);
      toast.error(err.message || "Registration failed");
    } finally {
        setLoading(false); // Set loading false afterward
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      toast.success("Logged out successfully.");
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginUser, registerUser, logoutUser }}>
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