import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { refresh, getAccessToken, clearStorage } from "../services/authService";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      (error.response?.data?.includes("Not authorized, token failed") ||
        error.response?.data?.includes("Not authorized, no token"))
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refresh();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          clearStorage();
          toast.error("Session expired, please login again");
          return Promise.reject(new Error("Unauthorized"));
        }
      } catch (refreshErr) {
        clearStorage();
        toast.error("Session expired, please login again");
        return Promise.reject(new Error("Unauthorized"));
      }
    }
    const errorMessage = error.response?.data?.message || error.message || "Request failed";
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export async function apiFetch<T>(url: string, options: AxiosRequestConfig = {}): Promise<T> {
  try {
    const res: AxiosResponse<T> = await axiosInstance(url, options);
    return res.data;
  } catch (err: any) {
    throw err; // Error already handled by interceptor
  }
}