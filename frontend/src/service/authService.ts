import api, { setTokens, clearTokens } from "../api/axiosInstance";
import type {
  LoginSchema,
  UserCreate,
  UserRead,
  TokenResponse,
} from "../../types/auth";

export const authService = {
  async login(payload: LoginSchema): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>("/auth/login", payload);
    setTokens(data.access_token, data.refresh_token);
    return data;
  },

  async register(payload: UserCreate): Promise<UserRead> {
    const { data } = await api.post<UserRead>("/auth/register", payload);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } finally {
      clearTokens();
    }
  },
};
