"use client";

import React from "react";
import {
  ListItem,
  Typography,
  Box,
  Chip,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Group as GroupIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

interface GroupListItemProps {
  id: number;
  name: string;
  createdAt: Date;
  companyName: string | null;
  currentParticipants?: number;
  maxParticipants?: number;
  status?: string;
  isSelected: boolean;
  onClick: (id: number) => void;
  onManage?: (id: number) => void;
}

export default function GroupListItem({
  id,
  name,
  createdAt,
  companyName,
  currentParticipants = 0,
  maxParticipants = 20,
  status = "active",
  isSelected,
  onClick,
  onManage,
}: GroupListItemProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "full":
        return "warning";
      case "closed":
        return "error";
      default:
        return "default";
    }
  };

  const getCapacityColor = () => {
    const percentage = (currentParticipants / maxParticipants) * 100;
    if (percentage >= 90) return "error";
    if (percentage >= 70) return "warning";
    return "primary";
  };

  return (
    <ListItem
      sx={{
        border: 1,
        borderColor: isSelected ? "primary.main" : "divider",
        borderRadius: 1,
        mb: 1,
        backgroundColor: isSelected ? "action.selected" : "background.paper",
        "&:hover": {
          backgroundColor: "action.hover",
          cursor: "pointer",
        },
        display: "flex",
        alignItems: "flex-start",
        p: 2,
      }}
    >
      {/* Left side - Clickable area */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flex: 1,
          cursor: "pointer",
        }}
        onClick={() => onClick(id)}
      >
        {/* Icon */}
        <Box sx={{ mr: 2, mt: 0.5 }}>
          <GroupIcon color={isSelected ? "primary" : "inherit"} />
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          {/* Primary content */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium">
              {name}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip
                label={`${currentParticipants}/${maxParticipants}`}
                size="small"
                color={getCapacityColor()}
                variant="outlined"
              />
              <Chip
                label={status}
                color={getStatusColor(status)}
                size="small"
                sx={{ textTransform: "capitalize" }}
              />
            </Box>
          </Box>

          {/* Secondary content */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {companyName && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <BusinessIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {companyName}
                </Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(createdAt).toLocaleDateString("bg-BG")}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right side - Manage button (separate from clickable area) */}
      {onManage && (
        <Box sx={{ ml: 2, alignSelf: "center" }}>
          <Tooltip title="Manage Group & Invitations">
            <Button
              size="small"
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onManage(id);
              }}
            >
              Manage
            </Button>
          </Tooltip>
        </Box>
      )}
    </ListItem>
  );
}
