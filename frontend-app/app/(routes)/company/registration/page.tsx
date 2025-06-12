"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useCompanyRegistration } from "@/app/hooks/useCompanyRegistration";
import { Business as BusinessIcon } from "@mui/icons-material";

const companyRegistrationSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  taxNumber: z.string().min(9, "Tax number must be at least 9 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  MOL: z.string().min(2, "MOL (Manager) name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  contactPersonName: z.string().min(2, "Contact person name is required"),
});

type CompanyRegistrationFormData = z.infer<typeof companyRegistrationSchema>;

export default function CompanyRegisterPage() {
  const { loading, errorMessage, successMessage, handleRegistration } =
    useCompanyRegistration();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyRegistrationFormData>({
    resolver: zodResolver(companyRegistrationSchema),
  });

  const onSubmit = (data: CompanyRegistrationFormData) => {
    handleRegistration(data);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 2, height: "100vh", display: "flex", alignItems: "center" }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          width: "100%",
          maxHeight: "95vh",
          overflow: "auto",
        }}
      >
        {/* Compact Header */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <BusinessIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              mb: 1,
            }}
          >
            Company Registration
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Register your company to access our professional training platform
          </Typography>
        </Box>

        {/* Error/Success Messages */}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Compact Form */}
        <Paper elevation={1} sx={{ p: 2, backgroundColor: "white" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {/* Company Information in 2 columns */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    mb: 1.5,
                    borderBottom: 1,
                    borderColor: "primary.light",
                    pb: 0.5,
                  }}
                >
                  Company Information
                </Typography>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <TextField
                    {...register("companyName")}
                    label="Company Name"
                    size="small"
                    fullWidth
                    required
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message}
                  />

                  <TextField
                    {...register("taxNumber")}
                    label="Tax Number (EIK/BULSTAT)"
                    size="small"
                    fullWidth
                    required
                    error={!!errors.taxNumber}
                    helperText={errors.taxNumber?.message}
                  />

                  <TextField
                    {...register("MOL")}
                    label="Manager (MOL)"
                    size="small"
                    fullWidth
                    required
                    error={!!errors.MOL}
                    helperText={errors.MOL?.message}
                  />

                  <TextField
                    {...register("address")}
                    label="Company Address"
                    size="small"
                    fullWidth
                    required
                    multiline
                    rows={2}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Box>
              </Grid>

              {/* Contact Information in 2nd column */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    mb: 1.5,
                    borderBottom: 1,
                    borderColor: "primary.light",
                    pb: 0.5,
                  }}
                >
                  Contact Information
                </Typography>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <TextField
                    {...register("contactPersonName")}
                    label="Contact Person Name"
                    size="small"
                    fullWidth
                    required
                    error={!!errors.contactPersonName}
                    helperText={errors.contactPersonName?.message}
                  />

                  <TextField
                    {...register("phoneNumber")}
                    label="Phone Number"
                    size="small"
                    fullWidth
                    required
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />

                  <TextField
                    {...register("email")}
                    label="Company Email"
                    type="email"
                    size="small"
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />

                  {/* Submit Button */}
                  <Box sx={{ mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        textTransform: "none",
                      }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Submitting...
                        </>
                      ) : (
                        "Submit Registration"
                      )}
                    </Button>
                  </Box>

                  {/* Footer Note */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontStyle: "italic",
                      textAlign: "center",
                      mt: 1,
                    }}
                  >
                    {`Your registration will be reviewed and you'll be notified
                    once approved.`}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Paper>
    </Container>
  );
}
