import { loginApi, logoutApi, registerApi, refreshApi } from "../api/authApi";
import type { LoginCredentials, RegisterCredentials, User } from "../types/auth";

let accessToken: string | null = null; // keep in memory

export async function login(credentials: LoginCredentials) {
  const { user, accessToken: at } = await loginApi(credentials);
  storeUser(user, at);
  return { user, accessToken: at };
}

export async function register(credentials: RegisterCredentials) {
  const { user, accessToken: at } = await registerApi(credentials);
  storeUser(user, at);
  return { user, accessToken: at };
}

export async function refresh() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  const { accessToken: at } = await refreshApi(refreshToken);
  accessToken = at;
  localStorage.setItem("accessToken", at);
  return at;
}

export async function logout() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) await logoutApi(refreshToken);
  clearUser();
}

export function getStoredUser(): User | null {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function getAccessToken(): string | null {
  return accessToken || localStorage.getItem("accessToken");
}

export function storeUser(user: User, at: string) {
  accessToken = at;
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("accessToken", at);
}

export function clearUser() {
  accessToken = null;
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
