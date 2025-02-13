import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser } from "../utils/api";

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  login: (data: {
    emailOrUsername: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  checkTokenValidity: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,

      login: async (data) => {
        const response = await loginUser(data);
        if (response.success && response.data?.token) {
          localStorage.setItem("token", response.data.token);
          set({ isAuthenticated: true, token: response.data.token });
          return true;
        }
        return false;
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ isAuthenticated: false, token: null });
      },

      checkTokenValidity: () => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            const expiry = payload.exp * 1000; // Convert expiry to milliseconds
            if (Date.now() > expiry) {
              console.warn("🚨 Token expired, logging out user.");
              set({ isAuthenticated: false, token: null });
              localStorage.removeItem("token");
            }
          } catch (error) {
            console.error("❌ Invalid token format", error);
            set({ isAuthenticated: false, token: null });
            localStorage.removeItem("token");
          }
        }
      },
    }),
    { name: "auth-storage" }
  )
);
