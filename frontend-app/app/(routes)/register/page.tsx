"use client";
import { useForm } from "react-hook-form";
import FormCard from "@/app/components/common/FormCard";
import PersonalInfoFields from "@/app/components/registration/PersonalInfoFields";
import CourseSelectionFields from "@/app/components/registration/CourseSelectionFields";
import AuthFields from "@/app/components/registration/AuthFields";
import SubmitButton from "@/app/components/registration/SubmitButton";
import {
  useCourseRegistration,
  RegistrationFormData,
} from "@/app/hooks/useCourseRegistration";

export default function RegisterPage() {
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
    formState: { errors },
  } = useForm<RegistrationFormData>();

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
