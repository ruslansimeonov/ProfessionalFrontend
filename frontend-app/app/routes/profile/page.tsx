"use client";

import React from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  ListItemIcon,
  Paper,
} from "@mui/material";
import {
  Description as DocumentIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import { useStore } from "@/app/store/useStore";
import DocumentUploader from "@/app/components/DocumentUploader";
import UserProfileCard from "@/app/components/UserProfileCard";
import EnrolledCoursesCard from "@/app/components/EnrolledCourses";
import ProfileUpdateForm from "@/app/components/ProfileUpdateForm";

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
      <ProfileUpdateForm user={user.details} onUpdateSuccess={handleDataUpdate} />

      {/* Enrolled Courses Card */}
      <EnrolledCoursesCard courses={user.enrolledCourses} />

      {/* Documents Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <DocumentIcon sx={{ mr: 1 }} />
          Your Documents
        </Typography>

        {user.documents?.length > 0 ? (
          <List>
            {user.documents.map((doc) => (
              <ListItem
                key={doc.id}
                sx={{
                  borderLeft: "4px solid",
                  borderColor: "primary.main",
                  pl: 2,
                  mb: 1,
                  backgroundColor: "background.default",
                  borderRadius: "0 4px 4px 0",
                }}
              >
                <ListItemIcon>
                  <DocumentIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={doc.documentType}
                  secondary={`Uploaded: ${new Date(
                    doc.uploadedAt
                  ).toLocaleDateString()}`}
                />
                <Button
                  href={doc.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                >
                  View
                </Button>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No documents uploaded yet.
          </Typography>
        )}
      </Paper>

      {/* Certificates Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <VerifiedIcon sx={{ mr: 1 }} />
          Your Certificates
        </Typography>

        {user.certificates?.length > 0 ? (
          <List>
            {user.certificates.map((cert) => (
              <ListItem
                key={cert.id}
                sx={{
                  borderLeft: "4px solid",
                  borderColor: "success.main",
                  pl: 2,
                  mb: 1,
                  backgroundColor: "background.default",
                  borderRadius: "0 4px 4px 0",
                }}
              >
                <ListItemIcon>
                  <VerifiedIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={`Certificate ${cert.id}`}
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                      </Typography>
                      <br />
                      <Typography variant="body2" component="span">
                        Expires:{" "}
                        {new Date(cert.expirationDate).toLocaleDateString()}
                      </Typography>
                    </>
                  }
                />
                <Button
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                >
                  View
                </Button>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No certificates available yet.
          </Typography>
        )}
      </Paper>

      {/* Document Uploader */}
      <DocumentUploader
        userId={user.details.id}
        onUploadSuccess={handleDataUpdate}
      />
    </Container>
  );
}
