import { StateCreator } from "zustand";

export type UIState = {
  isSidebarOpen: boolean;
  isDesktop: boolean;
  toggleSidebar: () => void;
  setIsDesktop: (isDesktop: boolean) => void;
};

export const createUISlice: StateCreator<UIState, [], [], UIState> = (set) => ({
  isSidebarOpen: false,
  isDesktop: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setIsDesktop: (isDesktop) => set({ isDesktop }),
});
