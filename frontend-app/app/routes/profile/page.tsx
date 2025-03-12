"use client";

import React from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import { useStore } from "@/app/store/useStore";
import UserProfileCard from "@/app/components/UserProfileCard";
import EnrolledCoursesCard from "@/app/components/EnrolledCourses";
import ProfileUpdateForm from "@/app/components/ProfileUpdateForm";
import DocumentsSection from "@/app/components/DocumentsSection";
import CertificatesSection from "@/app/components/CertificateSection";

export default function ProfilePage() {
  const fetchUser = useStore((state) => state.fetchUser);
  const user = useStore((state) => state.user);

  // Fetch user data on component mount
  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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

  return (
    <Container maxWidth="md">
      {/* User Profile Card */}
      <UserProfileCard user={user} />

      {/* Profile Update Form */}
      <ProfileUpdateForm
        user={user.details}
        onUpdateSuccess={handleDataUpdate}
      />

      {/* Enrolled Courses Card */}
      <EnrolledCoursesCard courses={user.enrolledCourses} />

      {/* Documents Section with integrated uploader */}
      <DocumentsSection
        documents={user.documents}
        userId={user.details.id}
        onUploadSuccess={handleDataUpdate}
      />

      {/* Certificates Section */}
      <CertificatesSection certificates={user.certificates} />
    </Container>
  );
}
