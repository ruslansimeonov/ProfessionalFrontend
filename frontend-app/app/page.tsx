"use client";

import React, { useEffect } from "react";
import { Container, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { School as SchoolIcon, Home as HomeIcon } from "@mui/icons-material";
import { useStore } from "@/app/store/useStore";
import { WelcomeCard } from "@/app/components/cards/WelcomeCard";
import { QuickActions } from "@/app/components/features/homepage/QuickActions";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useStore();

  // Navigation handlers
  const handleLogin = () => router.push("/login");
  const handleRegister = () => router.push("/register");
  const handleDashboard = () => {
    if (user?.role === "Admin") {
      router.push("/officePortal");
    } else {
      router.push("/dashboard");
    }
  };
  const handleCompanyPortal = () => router.push("/companyPortal");

  // Auto-redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      // Optional: Auto-redirect logic
      // setTimeout(() => handleDashboard(), 2000);
    }
  }, [isAuthenticated, user]);

  return (
    <Box
      sx={{
        minHeight: "80vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        marginTop: 5,
      }}
    >
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box sx={{ mb: 6, padding: 3, borderRadius: 2 }}>
          <WelcomeCard
            title="Добре дошли в нашата система"
            subtitle="Системата за управление на курсове за строителна техника"
            message="Hello from the TypeScript backend!"
            icon={<SchoolIcon />}
          />
        </Box>

        {/* Quick Actions Section */}
        <QuickActions
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onDashboard={handleDashboard}
          onCompanyPortal={handleCompanyPortal}
        />

        {/* User Greeting (if authenticated) */}
        {isAuthenticated && user && (
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <WelcomeCard
              title={`Здравейте, ${user.details?.firstName || "Потребител"}!`}
              subtitle="Добре дошли обратно в системата"
              icon={<HomeIcon />}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
