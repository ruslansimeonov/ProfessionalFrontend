"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import {
  QrCode as QrCodeIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { createInvitationCode } from "@/app/utils/apis/invitationCodes";

interface CreateInvitationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companyId: number | null;
  companyName?: string;
}

interface InvitationFormData {
  maxUses: number;
  validForDays: number;
}

export default function CreateInvitationDialog({
  open,
  onClose,
  onSuccess,
  companyId,
  companyName,
}: CreateInvitationDialogProps) {
  const [formData, setFormData] = useState<InvitationFormData>({
    maxUses: 50,
    validForDays: 30,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange =
    (field: keyof InvitationFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value) || 0;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (error) setError(null);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!companyId) {
      setError("Company ID is required");
      return;
    }

    if (formData.maxUses < 1 || formData.maxUses > 1000) {
      setError("Max uses must be between 1 and 1000");
      return;
    }

    if (formData.validForDays < 1 || formData.validForDays > 365) {
      setError("Valid for days must be between 1 and 365");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await createInvitationCode({
        companyId,
        maxUses: formData.maxUses,
        validForDays: formData.validForDays,
      });

      if (response.success) {
        setSuccess(
          `Invitation code created successfully: ${response.data.invitation.invitationCode}`
        );
        onSuccess();

        // Close dialog after a short delay
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.error || "Failed to create invitation code");
      }
    } catch (err) {
      console.error("Failed to create invitation code:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create invitation code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        maxUses: 50,
        validForDays: 30,
      });
      setError(null);
      setSuccess(null);
      onClose();
    }
  };

  const isFormValid =
    formData.maxUses >= 1 &&
    formData.maxUses <= 1000 &&
    formData.validForDays >= 1 &&
    formData.validForDays <= 365;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <QrCodeIcon />
        Create Invitation Code
      </DialogTitle>

      <DialogContent>
        {companyName && (
          <Box sx={{ mb: 2, p: 2, bgcolor: "primary.50", borderRadius: 1 }}>
            <Typography variant="body2" color="primary.main">
              Creating invitation code for: <strong>{companyName}</strong>
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={12}>
            <TextField
              required
              fullWidth
              label="Maximum Uses"
              type="number"
              value={formData.maxUses}
              onChange={handleChange("maxUses")}
              disabled={loading}
              inputProps={{ min: 1, max: 1000 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">uses</InputAdornment>
                ),
              }}
              helperText="How many people can use this invitation code (1-1000)"
            />
          </Grid>

          <Grid size={12}>
            <TextField
              required
              fullWidth
              label="Valid For (Days)"
              type="number"
              value={formData.validForDays}
              onChange={handleChange("validForDays")}
              disabled={loading}
              inputProps={{ min: 1, max: 365 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">days</InputAdornment>
                ),
              }}
              helperText="How many days the invitation code will be valid (1-365)"
            />
          </Grid>

          <Grid size={12}>
            <Box
              sx={{
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
                • Up to <strong>{formData.maxUses}</strong> people can use this
                code
              </Typography>
              <Typography variant="body2">
                • Code will expire in <strong>{formData.validForDays}</strong>{" "}
                days
              </Typography>
              <Typography variant="body2">
                • Users will be automatically linked to{" "}
                <strong>{companyName}</strong>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !isFormValid}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {loading ? "Creating..." : "Create Code"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
