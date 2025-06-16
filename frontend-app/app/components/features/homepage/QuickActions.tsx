// components/features/homepage/QuickActions.tsx
import React from "react";
import { Grid, Container, Typography } from "@mui/material";
import {
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Dashboard as DashboardIcon,
  Business as CompanyIcon,
} from "@mui/icons-material";
import { ActionCard } from "@/app/components/cards/ActionCard";

interface QuickActionsProps {
  isAuthenticated: boolean;
  userRole?: string;
  onLogin: () => void;
  onRegister: () => void;
  onDashboard: () => void;
  onCompanyPortal: () => void;
}

export function QuickActions({
  isAuthenticated,
  userRole,
  onLogin,
  onRegister,
  onDashboard,
  onCompanyPortal,
}: QuickActionsProps) {
  // Define actions based on authentication state and user role
  const getActions = () => {
    if (!isAuthenticated) {
      return [
        {
          title: "Вход в системата",
          description: "Влезте в профила си",
          icon: <LoginIcon fontSize="large" />,
          buttonText: "ОТВАРИАНЕ",
          onAction: onLogin,
          color: "primary" as const,
        },
        {
          title: "Регистрация",
          description: "Създайте нов профил и се запишете за курс",
          icon: <RegisterIcon fontSize="large" />,
          buttonText: "ОТВАРИАНЕ",
          onAction: onRegister,
          color: "success" as const,
        },
      ];
    }

    const actions = [];

    // Common actions for authenticated users
    if (userRole === "Admin") {
      actions.push({
        title: "Администраторски панел",
        description: "Управление на потребители и система",
        icon: <DashboardIcon fontSize="large" />,
        buttonText: "ОТВАРИАНЕ",
        onAction: onDashboard,
        color: "primary" as const,
      });
    }

    if (userRole === "Company" || userRole === "Admin") {
      actions.push({
        title: "Фирмен портал",
        description: "Управление на служители и курсове",
        icon: <CompanyIcon fontSize="large" />,
        buttonText: "ОТВАРИАНЕ",
        onAction: onCompanyPortal,
        color: "info" as const,
      });
    }

    return actions;
  };

  const actions = getActions();

  if (actions.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        component="h2"
        textAlign="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: "medium" }}
      ></Typography>

      <Grid container spacing={3} justifyContent="center">
        {actions.map((action, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <ActionCard {...action} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
