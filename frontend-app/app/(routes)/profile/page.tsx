"use client";

import React, { useEffect, useCallback } from "react";
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

  // Add a ref to track if we've already fetched data
  const hasInitiallyFetched = React.useRef(false);

  // Fetch user data only on component mount
  useEffect(() => {
    // Only fetch if not already fetched
    if (!hasInitiallyFetched.current) {
      console.log("🔄 Initial user data fetch");
      fetchUser();
      hasInitiallyFetched.current = true;
    }
  }, [fetchUser]);

  // Memoize handleDataUpdate to prevent unnecessary re-renders
  const handleDataUpdate = useCallback(() => {
    console.log("🔄 Manual data update triggered");
    fetchUser();
  }, [fetchUser]);

  // Use the hook only when user is available
  const {
    loading: loadingDocRequirements,
    missingDocumentNames,
    hasAllRequiredDocuments,
  } = useDocumentRequirements(user?.details?.id, user?.documents);

  console.log("User data:", user);

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

  // Check if required information is missing - memoize this calculation
  const isMissingPersonalInfo =
    !user.details.EGN ||
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

      {/* Profile Update Form - using memoized handler */}
      <ProfileUpdateForm
        user={user.details}
        onUpdateSuccess={handleDataUpdate}
        isMissingRequiredInfo={isMissingPersonalInfo}
      />

      {/* Documents Section with integrated uploader - using memoized handler */}
      <DocumentsSection
        documents={user.documents || []}
        userId={user.details.id}
        onUploadSuccess={handleDataUpdate}
        hasMissingDocuments={!hasAllRequiredDocuments}
        missingDocTypes={missingDocumentNames}
        isLoading={loadingDocRequirements}
        courseType={user?.enrolledCourses?.[0]?.course.courseType}
      />

      {/* Enrolled Courses Card */}
      <EnrolledCoursesCard courses={user.enrolledCourses || []} />

      {/* Certificates Section */}
      <CertificatesSection certificates={user.certificates || []} />
    </Container>
  );
}
