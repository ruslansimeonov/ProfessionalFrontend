"use client";

import { createContext, useContext } from "react";
import { useStore } from "../store/useStore";

interface ClientWrapperProps {
  children: React.ReactNode;
}

// ✅ Create a Context for `isDesktop`
const DeviceContext = createContext<boolean | undefined>(undefined);

// ✅ Custom Hook to use `isDesktop` anywhere
export const useDeviceContext = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDeviceContext must be used within a ClientWrapper");
  }
  return context;
};

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const isDesktop = useStore((state) => state.isDesktop);

  return (
    <DeviceContext.Provider value={isDesktop}>
      {children}
    </DeviceContext.Provider>
  );
}
