"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { CheckCircle, Cancel, Clear } from "@mui/icons-material";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { checkInvitationCode } from "@/app/utils/apis/invitationCodes";
import { RegistrationFormData } from "@/app/hooks/useCourseRegistration";

interface InvitationCodeFieldProps {
  register: UseFormRegister<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
  watch: (field: keyof RegistrationFormData) => string | undefined; // Fix: Replace 'any' with proper type
  setValue: UseFormSetValue<RegistrationFormData>; // Add setValue prop for clearing field
}

export default function InvitationCodeField({
  register,
  errors,
  watch,
  setValue,
}: InvitationCodeFieldProps) {
  const [validationState, setValidationState] = useState<{
    isChecking: boolean;
    isValid: boolean | null;
    message: string;
    companyName?: string;
  }>({
    isChecking: false,
    isValid: null,
    message: "",
  });

  const invitationCode = watch("invitationCode");

  useEffect(() => {
    const checkCode = async () => {
      if (!invitationCode || invitationCode.length < 8) {
        setValidationState({
          isChecking: false,
          isValid: null,
          message: "",
        });
        return;
      }

      setValidationState((prev) => ({ ...prev, isChecking: true }));

      try {
        const result = await checkInvitationCode(invitationCode);

        if (result.success) {
          setValidationState({
            isChecking: false,
            isValid: result.data.isValid,
            message: result.data.message,
            companyName: result.data.companyName,
          });
        } else {
          setValidationState({
            isChecking: false,
            isValid: false,
            message: result.error || "Error checking invitation code",
          });
        }
      } catch {
        // Fix: Remove unused 'error' parameter
        setValidationState({
          isChecking: false,
          isValid: false,
          message: "Error checking invitation code",
        });
      }
    };

    const debounceTimer = setTimeout(checkCode, 500);
    return () => clearTimeout(debounceTimer);
  }, [invitationCode]);

  const getEndAdornment = () => {
    if (validationState.isChecking) {
      return (
        <InputAdornment position="end">
          <CircularProgress size={20} />
        </InputAdornment>
      );
    }

    if (invitationCode && validationState.isValid !== null) {
      return (
        <InputAdornment position="end">
          {validationState.isValid ? (
            <CheckCircle color="success" />
          ) : (
            <Cancel color="error" />
          )}
        </InputAdornment>
      );
    }

    if (invitationCode) {
      return (
        <InputAdornment position="end">
          <IconButton
            size="small"
            onClick={() => {
              // Fix: Implement clear field functionality
              setValue("invitationCode", "");
              setValidationState({
                isChecking: false,
                isValid: null,
                message: "",
              });
            }}
            aria-label="Clear invitation code"
          >
            <Clear />
          </IconButton>
        </InputAdornment>
      );
    }

    return null;
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        Company Invitation Code (Optional)
      </Typography>

      <TextField
        {...register("invitationCode")}
        label="Invitation Code"
        placeholder="COMPANY-XXXX-XXXX"
        size="small"
        fullWidth
        error={!!errors.invitationCode || validationState.isValid === false}
        helperText={
          errors.invitationCode?.message ||
          validationState.message ||
          "Enter your company invitation code if you have one"
        }
        // Fix: Replace deprecated InputProps with slotProps.input
        slotProps={{
          input: {
            endAdornment: getEndAdornment(),
            style: { textTransform: "uppercase" },
          },
        }}
        onChange={(e) => {
          // Convert to uppercase automatically
          e.target.value = e.target.value.toUpperCase();
        }}
      />

      {validationState.isValid === true && validationState.companyName && (
        <Alert severity="success" sx={{ mt: 1 }}>
          <Typography variant="body2">
            <strong>Valid invitation for {validationState.companyName}</strong>
            <br />
            You will be automatically linked to this company after registration.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
