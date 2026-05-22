import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { navigate } from "../hooks/useNavigateRef";
import { type TokenResponse } from "../../types/auth";

const BASE_URL = import.meta.env.VITE_API_URL ?? "https://api.tuapp.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
export const setTokens = (at: string, rt?: string) => {
  localStorage.setItem("accessToken", at);
  if (rt) localStorage.setItem("refreshToken", rt);
};
export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

let isRefreshing = false;
let queue: Array<{
  resolve: (t: string) => void;
  reject: (e: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  queue = [];
};

// ── Request ──────────────────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response ─────────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<TokenResponse>(
        `${BASE_URL}/auth/refresh`,
        { refresh_token: getRefreshToken() },
      );
      setTokens(data.access_token, data.refresh_token);
      api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
      processQueue(null, data.access_token);
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return api(original);
    } catch (err) {
      processQueue(err, null);
      clearTokens();
      navigate("/login");
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
