// stores/useStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, createAuthSlice } from "./authSlice";

type StoreState = AuthState;

export const useStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args), // Add more slices here as needed
    }),
    { name: "app-store" }
  )
);
