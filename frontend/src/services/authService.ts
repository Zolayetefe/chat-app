import toast from "react-hot-toast";
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from "../types/auth";
import  { apiFetch } from "../api/api";

const AUTH_URL = "/auth";

// Token helpers
export function storeTokens(user: User, accessToken: string) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("accessToken", accessToken);
}

export function getStoredUser(): User | null {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
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
  const data = await apiFetch<AuthResponse>(`${AUTH_URL}/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  storeTokens(data.user, data.accessToken);
  toast.success("Logged in 🎉");
  return data;
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>(`${AUTH_URL}/register`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  storeTokens(data.user, data.accessToken);
  toast.success("Account created 🚀");
  return data;
}

export async function refresh(): Promise<string | null> {
  try {
    const data = await apiFetch<{ accessToken: string }>(`${AUTH_URL}/refresh`, {
      method: "POST",
    });
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await apiFetch(`${AUTH_URL}/logout`, { method: "POST" });
  clearStorage();
  toast("Logged out 👋", { icon: "👋" });
}

export async function getMe(): Promise<User> {
  return apiFetch<User>(`${AUTH_URL}/me`, { method: "GET" });
}
