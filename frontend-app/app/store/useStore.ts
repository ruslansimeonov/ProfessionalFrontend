import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createAuthSlice } from "./authSlice";
import { UIState, createUISlice } from "./uiSlice";
import { AuthState } from "../utils/types";

type StoreState = AuthState & UIState;

export const useStore = create<StoreState>()(
  persist(
    (set, get, store) => ({
      ...createAuthSlice(set, get, store),
      ...createUISlice(set, get, store),
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : sessionStorage
      ),
    }
  )
);
