// components/ui/cards/WelcomeCard.tsx
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

interface WelcomeCardProps {
  title: string;
  subtitle: string;
  message?: string;
  icon?: React.ReactNode;
}

export function WelcomeCard({
  title,
  subtitle,
  message,
  icon,
}: WelcomeCardProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
        color: "white",
        p: 4,
        borderRadius: 2,
        position: "relative",
        overflow: "hidden",
        mb: 4,
        mt: 4, // Add top margin
      }}
    >
      {/* Background Icon */}
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          opacity: 0.1,
          fontSize: "120px",
        }}
      >
        {icon}
      </Box>

      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        {title}
      </Typography>

      <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
        {subtitle}
      </Typography>

      {message && (
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <InfoIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {message}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
