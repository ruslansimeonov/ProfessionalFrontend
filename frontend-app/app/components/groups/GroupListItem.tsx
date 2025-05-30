import React from "react";
import {
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { formatDate } from "@/app/utils/documentUtils";

interface GroupListItemProps {
  id: number;
  name: string;
  createdAt: Date;
  companyName: string | null;
  isSelected: boolean;
  onClick: (id: number) => void;
}

export default function GroupListItem({
  id,
  name,
  createdAt,
  companyName,
  isSelected,
  onClick,
}: GroupListItemProps) {
  return (
    <React.Fragment>
      <ListItemButton
        selected={isSelected}
        onClick={() => onClick(id)}
        sx={{
          borderRadius: 1,
          mb: 1,
          "&.Mui-selected": {
            backgroundColor: "primary.light",
            "&:hover": {
              backgroundColor: "primary.main",
              opacity: 0.8,
            },
          },
        }}
      >
        <ListItemText
          primary={
            <Typography variant="subtitle1" component="div">
              {name}
            </Typography>
          }
          secondary={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mt: 1,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                component="span"
              >
                Created: {formatDate(createdAt)}
              </Typography>
              {companyName && (
                <Chip
                  size="small"
                  label={companyName}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          }
        />
      </ListItemButton>
      <Divider />
    </React.Fragment>
  );
}
