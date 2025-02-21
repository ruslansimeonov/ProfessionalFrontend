import { StateCreator } from "zustand";

export type UIState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const createUISlice: StateCreator<UIState, [], [], UIState> = (set) => ({
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
});
