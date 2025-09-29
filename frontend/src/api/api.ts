import { refresh, getAccessToken, clearStorage, storeTokens } from "../services/authService";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  let accessToken = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers, credentials: "include" });

    if (res.status === 401) {
      const errorText = await res.text();
      if (
        errorText.includes("Not authorized, token failed") ||
        errorText.includes("Not authorized, no token")
      ) {
        // Try refresh
        const newAccessToken = await refresh();
        if (newAccessToken) {
          // Retry request
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          };

          const retryRes = await fetch(`${API_BASE}${url}`, {
            ...options,
            headers: retryHeaders,
            credentials: "include",
          });

          if (!retryRes.ok) throw new Error(await retryRes.text());
          return retryRes.json();
        } else {
          clearStorage();
          toast.error("Session expired, please login again");
          throw new Error("Unauthorized");
        }
      }
    }

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  } catch (err: any) {
    toast.error(err.message || "Request failed");
    throw err;
  }
}
