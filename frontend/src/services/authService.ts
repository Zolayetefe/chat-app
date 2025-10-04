import toast from "react-hot-toast";
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from "../types/auth";
import { apiFetch } from "../api/api";
import type { AxiosRequestConfig } from "axios";

const AUTH_URL = "/auth";

// Token helpers
export function storeTokens(user: User, accessToken: string) {
  if (!user || !accessToken) {
    console.error("storeTokens: Invalid user or accessToken", { user, accessToken });
    return;
  }
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("accessToken", accessToken);
}

export function getStoredUser(): User | null {
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (err) {
    console.error("getStoredUser: Failed to parse user from localStorage", err);
    localStorage.removeItem("user"); // Clean up invalid data
    return null;
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

export function clearStorage() {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
}

// Auth actions
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const config: AxiosRequestConfig = {
    method: "POST",
    data: credentials, // Axios handles JSON.stringify
  };

  const data = await apiFetch<AuthResponse>(`${AUTH_URL}/login`, config);
  console.log("Login response:", data); // Debug
  const { user, accessToken } = data;
  if (!user || !accessToken) {
    throw new Error("Invalid login response: Missing user or access token");
  }
  storeTokens(user, accessToken);
  toast.success("Logged in 🎉");
  return { user, accessToken };
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const config: AxiosRequestConfig = {
    method: "POST",
    data: credentials, // Axios handles JSON.stringify
  };

  const data = await apiFetch<AuthResponse>(`${AUTH_URL}/register`, config);
  console.log("Register response:", data); // Debug
  const { user, accessToken } = data;
  console.log("user:", user);
  console.log("accessToken:", accessToken);
  if (!user || !accessToken) {
    throw new Error("Invalid register response: Missing user or access token");
  }
  storeTokens(user, accessToken);
  toast.success("Account created 🚀");
  return { user, accessToken };
}

export async function refresh(): Promise<string | null> {
  try {
    const config: AxiosRequestConfig = {
      method: "POST",
    };
    const data = await apiFetch<{ accessToken: string }>(`${AUTH_URL}/refresh`, config);
    console.log("Refresh response:", data); // Debug
    const { accessToken } = data;
    if (!accessToken) {
      throw new Error("Invalid refresh response: Missing access token");
    }
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  const config: AxiosRequestConfig = {
    method: "POST",
  };
  await apiFetch(`${AUTH_URL}/logout`, config);
  clearStorage();
  toast("Logged out 👋", { icon: "👋" });
}

export async function getMe(): Promise<User> {
  const config: AxiosRequestConfig = {
    method: "GET",
  };
  const data = await apiFetch<User>(`${AUTH_URL}/me`, config);
  console.log("GetMe response:", data); // Debug
  return data;
}