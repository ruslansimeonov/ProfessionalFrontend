"use client";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import FormCard from "@/app/components/common/FormCard";
import PersonalInfoFields from "@/app/components/registration/PersonalInfoFields";
import CourseSelectionFields from "@/app/components/registration/CourseSelectionFields";
import AuthFields from "@/app/components/registration/AuthFields";
import InvitationCodeField from "@/app/components/invitation/InvitationInput"; // Updated import path
import SubmitButton from "@/app/components/registration/SubmitButton";
import {
  useCourseRegistration,
  RegistrationFormData,
} from "@/app/hooks/useCourseRegistration";
import { Box, CircularProgress } from "@mui/material";

function RegisterForm() {
  const searchParams = useSearchParams();
  const invitationCode = searchParams.get("code");

  const {
    courses,
    cities,
    loading,
    errorMessage,
    successMessage,
    handleRegistration,
    validateFullName,
  } = useCourseRegistration();

  const {
    register,
    handleSubmit,
    watch,
    setValue, // Add setValue
    formState: { errors },
  } = useForm<RegistrationFormData>();

  // Set invitation code from URL parameter
  useEffect(() => {
    if (invitationCode) {
      setValue("invitationCode", invitationCode.toUpperCase());
    }
  }, [invitationCode, setValue]);

  return (
    <FormCard
      title="Записване за Курс"
      errorMessage={errorMessage}
      successMessage={successMessage}
    >
      <form onSubmit={handleSubmit(handleRegistration)}>
        {/* Personal Information */}
        <PersonalInfoFields
          register={register}
          errors={errors}
          validateFullName={validateFullName}
        />

        {/* Company Invitation Code */}
        <InvitationCodeField
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue} // Pass setValue prop
        />

        {/* Course Selection */}
        <CourseSelectionFields
          register={register}
          errors={errors}
          courses={courses}
          cities={cities}
          loading={loading}
        />

        {/* Authentication Fields */}
        <AuthFields register={register} errors={errors} />

        {/* Submit Button */}
        <SubmitButton
          isLoading={loading.courses || loading.cities || loading.submission}
        />
      </form>
    </FormCard>
  );
}

// Loading component for Suspense fallback
function RegisterPageLoading() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
      }}
    >
      <CircularProgress size={40} />
    </Box>
  );
}

// Main page component with Suspense wrapper
export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterPageLoading />}>
      <RegisterForm />
    </Suspense>
  );
}
