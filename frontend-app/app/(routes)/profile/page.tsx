"use client";

import React from "react";
import { Container, CircularProgress, Box } from "@mui/material";
import { useStore } from "@/app/store/useStore";
import UserProfileCard from "@/app/components/UserProfileCard";
import EnrolledCoursesCard from "@/app/components/EnrolledCourses";
import ProfileUpdateForm from "@/app/components/ProfileUpdateForm";
import DocumentsSection from "@/app/components/DocumentsSection";
import CertificatesSection from "@/app/components/CertificateSection";
import ProfileCompletionStatus from "@/app/components/ProfileCompletionStatus";
import { useDocumentRequirements } from "@/app/hooks/useDocumentRequirements";

export default function ProfilePage() {
  const fetchUser = useStore((state) => state.fetchUser);
  const user = useStore((state) => state.user);

  // Fetch user data on component mount
  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Use the new hook to handle document requirements
  const {
    loading: loadingDocRequirements,
    missingDocumentNames,
    hasAllRequiredDocuments,
  } = useDocumentRequirements(user?.details?.id, user?.documents);

  // Show loading if user is not yet loaded
  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Handle successful document upload or profile update
  const handleDataUpdate = () => {
    // Re-fetch user data to update the UI
    fetchUser();
  };

  // Check if required information is missing
  const isMissingPersonalInfo =
    !user.details.egn ||
    !user.details.birthPlaceAddress ||
    !user.details.currentResidencyAddress;

  // Calculate profile completion steps
  const completedSteps =
    (isMissingPersonalInfo ? 0 : 1) + (hasAllRequiredDocuments ? 1 : 0);

  return (
    <Container maxWidth="md">
      {/* Profile Completion Alert for new users */}
      <ProfileCompletionStatus
        isMissingPersonalInfo={isMissingPersonalInfo}
        hasMissingDocuments={!hasAllRequiredDocuments}
        missingDocTypes={missingDocumentNames}
        completedSteps={completedSteps}
        isLoading={loadingDocRequirements}
      />

      {/* User Profile Card */}
      <UserProfileCard user={user} />

      {/* Profile Update Form */}
      <ProfileUpdateForm
        user={user.details}
        onUpdateSuccess={handleDataUpdate}
        isMissingRequiredInfo={isMissingPersonalInfo}
      />

      {/* Documents Section with integrated uploader */}
      <DocumentsSection
        documents={user.documents}
        userId={user.details.id}
        onUploadSuccess={handleDataUpdate}
        hasMissingDocuments={!hasAllRequiredDocuments}
        missingDocTypes={missingDocumentNames}
        isLoading={loadingDocRequirements}
        courseType={user.enrolledCourses[0]?.course.courseType} // when we have multiple courses give the latest one
      />

      {/* Enrolled Courses Card */}
      <EnrolledCoursesCard courses={user.enrolledCourses} />

      {/* Certificates Section */}
      <CertificatesSection certificates={user.certificates} />
    </Container>
  );
}
