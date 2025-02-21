"use client";

import { useDeviceContext } from "./ClientWrapper";
import { Box } from "@mui/material";

export default function ClientContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDesktop = useDeviceContext(); // ✅ This is now safely inside a client component
  console.log(isDesktop, "isDesktop");
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        marginTop: "64px", // ✅ Prevents content from being covered by navbar
        marginLeft: isDesktop ? "100px" : "0px", // ✅ Only apply left margin on desktop
        transition: "margin-left 0.3s ease-in-out", // ✅ Smooth transition for sidebar toggle
      }}
    >
      {children}
    </Box>
  );
}
