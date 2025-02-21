"use client";

import { useEffect } from "react";
import { useStore } from "../store/useStore";
import { useMediaQuery } from "@mui/material";

export default function ClientProvider() {
  const setIsDesktop = useStore((state) => state.setIsDesktop);
  const isDesktop = useMediaQuery("(min-width: 1024px)"); // ✅ Detects desktop

  useEffect(() => {
    setIsDesktop(isDesktop); // ✅ Update Zustand store when screen size changes
  }, [isDesktop, setIsDesktop]);

  return null; // ✅ This component does not render anything
}
