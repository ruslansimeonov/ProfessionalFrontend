import { StateCreator } from "zustand";
import { loginUser, getAuthenticatedUser } from "../utils/apis/api";
import { AuthState } from "../utils/types/types";

export const createAuthSlice: StateCreator<AuthState, [], [], AuthState> = (
  set,
  get
) => ({
  isAuthenticated: false,
  token: null,
  user: null,
  roles: null,

  login: async (data) => {
    console.log("Login");
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
    console.log("Logout");
    localStorage.removeItem("token");
    set({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  },

  fetchUser: async () => {
    try {
      console.log("Fetch User");
      const response = await getAuthenticatedUser();
      if (response.success) {
        set({
          user: {
            details: response.data.details,
            company: response.data.company,
            enrolledCourses: response.data.enrolledCourses,
            documents: response.data.documents || [],
            certificates: response.data.certificates || [],
            role:
              Array.isArray(response.data.role) && response.data.role.length > 0
                ? response.data.role[0]
                : "Student", // Default role if none is provided
          },
        });
      } else {
        console.error("Failed to fetch user:", response.error);
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
