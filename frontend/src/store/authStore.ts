import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/service/authService";
import type { UserRead, LoginSchema, UserCreate } from "@/types/auth";

interface AuthState {
  user: UserRead | null;
  isAuthenticated: boolean;

  login: (payload: LoginSchema) => Promise<void>;
  register: (payload: UserCreate) => Promise<void>;
  profile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (payload) => {
        await authService.login(payload);

        const user = await authService.profile();
        set({ user, isAuthenticated: true });
      },

      register: async (payload) => {
        await authService.register(payload);
      },

      profile: async () => {
        try {
          const user = await authService.profile();
          set({ user, isAuthenticated: true });
        } catch {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      logout: async () => {
        await authService.logout();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      partialize(state) {
        return {
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        };
      },
    },
  ),
);
