import type{ LoginCredentials, RegisterCredentials, AuthResponse } from "../types/auth";

const API_URL = "http://localhost:5000/api/v1/auth";

export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) throw new Error("Failed to login");
  return res.json();
}

export async function registerApi(credentials: RegisterCredentials): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) throw new Error("Failed to register");
  return res.json();
}

export async function refreshApi(refreshToken: string): Promise<{ accessToken: string }> {
  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error("Failed to refresh token");
  return res.json();
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
}
