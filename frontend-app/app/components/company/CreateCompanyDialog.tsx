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
} from "@mui/material";
import {
  Business as BusinessIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { getAuthToken } from "@/app/utils/tokenHelpers";

interface CreateCompanyDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CompanyFormData {
  companyName: string;
  taxNumber: string;
  address: string;
  MOL: string;
  phoneNumber: string;
  email: string;
}

export default function CreateCompanyDialog({
  open,
  onClose,
  onSuccess,
}: CreateCompanyDialogProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: "",
    taxNumber: "",
    address: "",
    MOL: "",
    phoneNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function createCompany(data: CompanyFormData) {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const response = await fetch(`${baseUrl}/api/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create company");
    }

    const company = await response.json();
    return { success: true, data: company };
  } catch (error) {
    console.error("Create company error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create company",
    };
  }
}

  const handleChange =
    (field: keyof CompanyFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      // Clear errors when user starts typing
      if (error) setError(null);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate required fields
    if (!formData.companyName.trim() || !formData.taxNumber.trim()) {
      setError("Company name and tax number are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await createCompany(formData);

      if (response.success) {
        setSuccess("Company created successfully");
        onSuccess();

        // Close dialog after a short delay
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError(response.error || "Failed to create company");
      }
    } catch (error) {
      console.error("Failed to create company:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create company"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        companyName: "",
        taxNumber: "",
        address: "",
        MOL: "",
        phoneNumber: "",
        email: "",
      });
      setError(null);
      setSuccess(null);
      onClose();
    }
  };

  const isFormValid = formData.companyName.trim() && formData.taxNumber.trim();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <BusinessIcon />
        Create New Company
      </DialogTitle>

      <DialogContent>
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
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              required
              fullWidth
              label="Company Name"
              value={formData.companyName}
              onChange={handleChange("companyName")}
              disabled={loading}
              autoFocus
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              required
              fullWidth
              label="Tax Number"
              value={formData.taxNumber}
              onChange={handleChange("taxNumber")}
              disabled={loading}
              placeholder="BG123456789"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={handleChange("address")}
              disabled={loading}
              multiline
              rows={2}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Manager (MOL)"
              value={formData.MOL}
              onChange={handleChange("MOL")}
              disabled={loading}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange("phoneNumber")}
              disabled={loading}
              placeholder="0888123456"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              disabled={loading}
              placeholder="info@company.com"
            />
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
          {loading ? "Creating..." : "Create Company"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
