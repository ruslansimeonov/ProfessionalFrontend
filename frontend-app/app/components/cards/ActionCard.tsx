// components/ui/cards/ActionCard.tsx
import React from "react";
import { Box, Typography, Button, Paper, useTheme } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onAction: () => void;
  color?: "primary" | "secondary" | "success" | "info";
}

export function ActionCard({
  title,
  description,
  icon,
  buttonText,
  onAction,
  color = "primary",
}: ActionCardProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          elevation: 6,
          transform: "translateY(-4px)",
          "& .action-button": {
            backgroundColor: theme.palette[color].main,
            color: "white",
          },
        },
      }}
      onClick={onAction}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: `${color}.main`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          mb: 2,
          mx: "auto",
        }}
      >
        {icon}
      </Box>

      {/* Content */}
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        textAlign="center"
        fontWeight="medium"
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ flexGrow: 1, mb: 2 }}
      >
        {description}
      </Typography>

      {/* Action Button */}
      <Button
        className="action-button"
        variant="outlined"
        endIcon={<ArrowIcon />}
        fullWidth
        sx={{
          mt: "auto",
          borderColor: `${color}.main`,
          color: `${color}.main`,
          "&:hover": {
            borderColor: `${color}.main`,
          },
        }}
      >
        {buttonText}
      </Button>
    </Paper>
  );
}
