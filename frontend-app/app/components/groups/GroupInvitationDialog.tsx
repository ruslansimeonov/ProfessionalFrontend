"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Grid,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  Group as GroupIcon,
  Close as CloseIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { createGroupInvitation } from "../../utils/apis/groupInvitationCodes";

interface GroupInvitationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  groupId: number | null;
  groupName?: string;
}

export default function GroupInvitationDialog({
  open,
  onClose,
  onSuccess,
  groupId,
  groupName,
}: GroupInvitationDialogProps) {
  const [description, setDescription] = useState("");
  const [maxUses, setMaxUses] = useState(50);
  const [validForDays, setValidForDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!groupId || !validForDays) {
      setError("Group ID and valid days are required");
      return;
    }

    if (validForDays < 1 || validForDays > 365) {
      setError("Valid days must be between 1 and 365");
      return;
    }

    if (maxUses < 1 || maxUses > 1000) {
      setError("Max uses must be between 1 and 1000");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Calculate expiration date
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + validForDays);

      const response = await createGroupInvitation(groupId, {
        description: description.trim() || undefined,
        maxUses: maxUses || 50,
        expiresAt: expirationDate.toISOString(),
      });

      if (response.success) {
        onSuccess();
        handleClose();
      } else {
        setError(response.error || "Failed to create invitation");
      }
    } catch (err) {
      console.error("Error creating group invitation:", err);
      setError("Failed to create invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDescription("");
    setMaxUses(50);
    setValidForDays(30);
    setError(null);
    onClose();
  };

  // Calculate expiration date for preview
  const getExpirationDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + validForDays);
    return date.toLocaleDateString("bg-BG");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GroupIcon color="primary" />
          <Typography variant="h6">Create Group Invitation</Typography>
        </Box>
        <Button
          onClick={handleClose}
          size="small"
          sx={{ minWidth: "auto", p: 0.5 }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent>
        {groupName && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Creating invitation code for group: <strong>{groupName}</strong>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Description (Optional)"
              multiline
              rows={3}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this invitation is for..."
              helperText="This will help you identify the invitation later"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Maximum Uses"
              type="number"
              fullWidth
              value={maxUses}
              onChange={(e) => setMaxUses(Number(e.target.value))}
              inputProps={{ min: 1, max: 1000 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">uses</InputAdornment>
                ),
              }}
              helperText="How many people can use this code (1-1000)"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Valid For (Days)"
              type="number"
              fullWidth
              value={validForDays}
              onChange={(e) => setValidForDays(Number(e.target.value))}
              inputProps={{ min: 1, max: 365 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">days</InputAdornment>
                ),
              }}
              helperText={`Expires on: ${getExpirationDate()}`}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> Users registering with this code will be
            automatically added to the group.
            {groupName?.includes("Company") && (
              <span>
                {" "}
                If the group belongs to a company, users will also be assigned
                to that company.
              </span>
            )}
          </Typography>
        </Box>

        {/* Invitation Summary */}
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 1,
            border: 1,
            borderColor: "grey.200",
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Invitation Summary:</strong>
          </Typography>
          <Typography variant="body2">
            • Up to <strong>{maxUses}</strong> people can use this code
          </Typography>
          <Typography variant="body2">
            • Valid for <strong>{validForDays}</strong> days (expires{" "}
            {getExpirationDate()})
          </Typography>
          {description.trim() && (
            <Typography variant="body2">
              • Description: <strong>{description.trim()}</strong>
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || validForDays < 1 || maxUses < 1}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Creating...
            </>
          ) : (
            "Create Invitation"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
