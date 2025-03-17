import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Paper,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DocumentIcon from "@mui/icons-material/Description";
import SchoolIcon from "@mui/icons-material/School";
import ProfileUpdateForm from "../ProfileUpdateForm";
import DocumentsSection from "../DocumentsSection";
import { User } from "@/app/utils/types/types";

interface AdminUserProfileEditorProps {
  user: User;
  missingDocumentNames: string[];
  hasAllRequiredDocuments: boolean;
  loadingDocRequirements: boolean;
  onUserUpdate: () => void;
}

export default function AdminUserProfileEditor({
  user,
  missingDocumentNames,
  hasAllRequiredDocuments,
  loadingDocRequirements,
  onUserUpdate,
}: AdminUserProfileEditorProps) {
  console.log("AdminUserProfile", user);
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
    open: boolean;
  }>({
    message: "",
    type: "success",
    open: false,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUpdateSuccess = () => {
    onUserUpdate();
    setNotification({
      message: "Профилът беше успешно актуализиран",
      type: "success",
      open: true,
    });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const latestEnrolledCourse = user.enrolledCourses && user.enrolledCourses[0];
  const courseType = latestEnrolledCourse?.course?.courseType || null;

  return (
    <>
      <Paper elevation={3} sx={{ mt: 3, p: 0, overflow: "hidden" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="Admin editor tabs"
          >
            <Tab
              icon={<PersonIcon />}
              label="Лична информация"
              id="profile-tab"
              aria-controls="profile-panel"
            />
            <Tab
              icon={<DocumentIcon />}
              label="Документи"
              id="documents-tab"
              aria-controls="documents-panel"
            />
            <Tab
              icon={<SchoolIcon />}
              label="Курсове"
              id="courses-tab"
              aria-controls="courses-panel"
            />
          </Tabs>
        </Box>

        {/* Personal Information Tab */}
        <Box
          role="tabpanel"
          hidden={tabValue !== 0}
          id="profile-panel"
          aria-labelledby="profile-tab"
          sx={{ p: 3 }}
        >
          {tabValue === 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Редактиране на профила
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                Редактиране на личните данни на потребителя като администратор.
              </Alert>

              {console.log("adminUserEdit", user.details)}

              <ProfileUpdateForm
                user={user.details}
                onUpdateSuccess={handleUpdateSuccess}
                isAdmin={true}
                userId={user.details.id}
                isMissingRequiredInfo={
                  !user.details.EGN ||
                  !user.details.birthPlaceAddress ||
                  !user.details.currentResidencyAddress
                }
              />
            </>
          )}
        </Box>

        {/* Documents Tab */}
        <Box
          role="tabpanel"
          hidden={tabValue !== 1}
          id="documents-panel"
          aria-labelledby="documents-tab"
        >
          {tabValue === 1 && (
            <DocumentsSection
              documents={user.documents || []}
              userId={user.details.id}
              onUploadSuccess={handleUpdateSuccess}
              hasMissingDocuments={!hasAllRequiredDocuments}
              missingDocTypes={missingDocumentNames}
              isLoading={loadingDocRequirements}
              courseType={courseType}
              isAdminMode={true}
            />
          )}
        </Box>

        {/* Courses Tab */}
        <Box
          role="tabpanel"
          hidden={tabValue !== 2}
          id="courses-panel"
          aria-labelledby="courses-tab"
          sx={{ p: 3 }}
        >
          {tabValue === 2 && (
            <>
              <Typography variant="h6" gutterBottom>
                Курсове на потребителя
              </Typography>

              {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                <Box>
                  {user.enrolledCourses.map((enrollment) => (
                    <Paper
                      key={enrollment.id}
                      variant="outlined"
                      sx={{ p: 2, mb: 2 }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {enrollment.course.courseName}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Тип: {enrollment.course.courseType}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Записан на:{" "}
                        {new Date(enrollment.enrolledAt).toLocaleDateString(
                          "bg-BG"
                        )}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Статус: Да се добави
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Alert severity="info">
                  Потребителят не е записан в никакви курсове.
                </Alert>
              )}
            </>
          )}
        </Box>
      </Paper>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
