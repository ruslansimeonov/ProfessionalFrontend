import React from 'react';
import { TextField } from '@mui/material';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { RegistrationFormData } from '../../hooks/useCourseRegistration';

interface PersonalInfoFieldsProps {
  register: UseFormRegister<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
  validateFullName: (value: string) => string | boolean;
}

export default function PersonalInfoFields({ 
  register, 
  errors, 
  validateFullName 
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
        {...register("phoneNumber", {
          required: "Телефонът е задължителен",
          pattern: {
            value: /^[0-9+\-()\s]{6,20}$/,
            message: "Моля, въведете валиден телефонен номер",
          },
        })}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber?.message}
      />
    </>
  );
}