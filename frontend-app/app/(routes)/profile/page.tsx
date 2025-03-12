"use client";

import React from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Alert,
  AlertTitle,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from "@mui/material";
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

  // Check if required information is missing
  const isMissingPersonalInfo =
    !user.details.EGN ||
    !user.details.birthPlaceAddress ||
    !user.details.currentResidencyAddress;

  // Check if required documents are missing (adapt this based on your document types)
  const requiredDocTypes = [
    "Diploma",
    "DriverLicense",
    "MedicalCertificate",
    "PassportPhotos",
  ];
  const uploadedDocTypes = user.documents.map(
    (doc) => doc.documentType?.toLowerCase() || ""
  );

  const missingDocTypes = requiredDocTypes.filter(
    (reqType) =>
      !uploadedDocTypes.some((uploadedType) =>
        uploadedType.toLowerCase().includes(reqType.toLowerCase())
      )
  );

  const hasMissingDocuments = missingDocTypes.length > 0;

  // Calculate profile completion steps
  const totalSteps = 2; // Personal info + Required documents
  const completedSteps =
    (isMissingPersonalInfo ? 0 : 1) + (hasMissingDocuments ? 0 : 1);

  return (
    <Container maxWidth="md">
      {/* Profile Completion Alert for new users */}
      {(isMissingPersonalInfo || hasMissingDocuments) && (
        <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: "primary.50" }}>
          <Alert
            severity={completedSteps === 0 ? "warning" : "info"}
            sx={{ mb: 2 }}
          >
            <AlertTitle>
              <strong>
                {completedSteps === 0
                  ? "Моля, попълнете данните си за да завършите регистрацията"
                  : "Профилът ви е почти завършен"}
              </strong>
            </AlertTitle>
            За да завършите процеса на регистрация, моля попълнете необходимата
            информация и качете изискуемите документи.
          </Alert>

          <Stepper activeStep={completedSteps} alternativeLabel sx={{ mt: 3 }}>
            <Step>
              <StepLabel error={isMissingPersonalInfo}>
                <Typography variant="body2" component="div">
                  Лична информация
                  {isMissingPersonalInfo && (
                    <Typography
                      variant="caption"
                      component="div"
                      color="error.main"
                    >
                      Изисква се: ЕГН, Местораждане, Постоянно местожителство
                    </Typography>
                  )}
                </Typography>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel error={hasMissingDocuments}>
                <Typography variant="body2" component="div">
                  Качване на документи
                  {hasMissingDocuments && (
                    <Typography
                      variant="caption"
                      component="div"
                      color="error.main"
                    >
                      Изисква се: {missingDocTypes.join(", ")}
                    </Typography>
                  )}
                </Typography>
              </StepLabel>
            </Step>
          </Stepper>
        </Paper>
      )}

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
        hasMissingDocuments={hasMissingDocuments}
        missingDocTypes={missingDocTypes}
      />

      {/* Enrolled Courses Card */}
      <EnrolledCoursesCard courses={user.enrolledCourses} />

      {/* Certificates Section */}
      <CertificatesSection certificates={user.certificates} />
    </Container>
  );
}
