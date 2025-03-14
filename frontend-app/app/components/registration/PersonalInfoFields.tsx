import React from "react";
import { TextField } from "@mui/material";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { RegistrationFormData } from "../../hooks/useCourseRegistration";

interface PersonalInfoFieldsProps {
  register: UseFormRegister<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
  validateFullName: (value: string) => string | boolean;
}

export default function PersonalInfoFields({
  register,
  errors,
  validateFullName,
}: PersonalInfoFieldsProps) {
  return (
    <>
      {/* Full Name (3 parts) */}
      <TextField
        fullWidth
        label="Име (Три имена)"
        margin="normal"
        {...register("fullName", {
          required: "Моля, въведете трите си имена.",
          validate: validateFullName,
        })}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
      />

      {/* Phone Number */}
      <TextField
        fullWidth
        label="Телефон"
        margin="normal"
        placeholder="0888 123 456"
        {...register("phoneNumber", {
          required: "Телефонът е задължителен",
          validate: (value) => {
            // Remove spaces, dashes, parentheses for validation
            const cleaned = value.replace(/[\s\-()]/g, "");

            // Check minimum/maximum length (international numbers can be longer)
            if (cleaned.length < 7) {
              return "Телефонният номер е твърде къс";
            }

            if (cleaned.length > 15) {
              return "Телефонният номер е твърде дълъг";
            }

            // Check for valid characters
            if (!/^[0-9+]+$/.test(cleaned)) {
              return "Телефонният номер може да съдържа само цифри, +, интервали и тирета";
            }

            // Special validation for numbers that appear to be Bulgarian
            if (
              cleaned.startsWith("+359") ||
              cleaned.startsWith("359") ||
              cleaned.startsWith("0")
            ) {
              // Bulgarian mobile pattern
              const bgMobilePattern =
                /^(?:\+359|359|0)(?:87|88|89|98|99)[0-9]{7}$/;
              // Bulgarian landline pattern (simplified)
              const bgLandlinePattern =
                /^(?:\+359|359|0)(?:2|[3-9][0-9])[0-9]{5,7}$/;

              const isBgNumber =
                bgMobilePattern.test(cleaned) ||
                bgLandlinePattern.test(cleaned);

              if (!isBgNumber) {
                return "Изглежда сте въвели български номер, но форматът не е валиден";
              }
            }

            return true;
          },
        })}
        error={!!errors.phoneNumber}
        helperText={
          errors.phoneNumber?.message ||
          "Например: 088 123 4567 или +359 88 123 4567"
        }
      />
    </>
  );
}
