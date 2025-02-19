// stores/authSlice.ts
import { StateCreator } from "zustand";
import { loginUser, getAuthenticatedUser } from "../utils/apis/api";
import { User } from "../utils/types";

export type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (data: {
    emailOrUsername: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  checkTokenValidity: () => void;
  fetchUser: () => Promise<void>;
};

export const createAuthSlice: StateCreator<AuthState> = (set, get) => ({
  isAuthenticated: false,
  token: null,
  user: null,

  login: async (data) => {
    const response = await loginUser(data);
    if (response.success && response.data?.token) {
      localStorage.setItem("token", response.data.token);
      set({ isAuthenticated: true, token: response.data.token });

      await get().fetchUser();
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ isAuthenticated: false, token: null, user: null });
  },

  fetchUser: async () => {
    try {
      const response = await getAuthenticatedUser();
      if (response.success) {
        set({ user: response.data });
      } else {
        get().logout();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      get().logout();
    }
  },

  checkTokenValidity: () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        const expiry = payload.exp * 1000; // Convert to milliseconds
        if (Date.now() > expiry) {
          console.warn("🚨 Token expired, logging out user.");
          get().logout();
        }
      } catch (error) {
        console.error("❌ Invalid token format", error);
        get().logout();
      }
    }
  },
});
