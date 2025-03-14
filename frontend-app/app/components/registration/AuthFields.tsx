import React from "react";
import { TextField, Box } from "@mui/material";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { RegistrationFormData } from "../../hooks/useCourseRegistration";

interface AuthFieldsProps {
  register: UseFormRegister<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
}

export default function AuthFields({ register, errors }: AuthFieldsProps) {
  return (
    <>
      {/* Email (username) */}
      <TextField
        fullWidth
        label="Имейл (за вход)"
        type="email"
        margin="normal"
        {...register("email", {
          required: "Имейлът е задължителен",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Невалиден имейл формат",
          },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      {/* Password Field */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <TextField
          fullWidth
          label="Парола"
          type="password"
          {...register("password", {
            required: "Паролата е задължителна",
            minLength: {
              value: 6,
              message: "Паролата трябва да е поне 6 символа",
            },
          })}
          error={!!errors.password}
          helperText={
            errors.password?.message ||
            "Използвайте парола, за да имате достъп до учебните материали и да прикачвате документи."
          }
        />
      </Box>
    </>
  );
}
