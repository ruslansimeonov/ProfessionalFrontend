"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useStore } from "@/app/store/useStore";

export default function ProfilePage() {
  const fetchUser = useStore((state) => state.fetchUser);
  const user = useStore((state) => state.user);

  fetchUser();

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

  return (
    <Container maxWidth="md">
      <Card sx={{ mt: 4, p: 3, boxShadow: 3 }}>
        <CardContent>
          {/* User Avatar */}
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
              {user.details.firstName}
            </Avatar>
          </Box>
          {/* User Name */}
          <Typography variant="h5" align="center">
            {user.details.firstName} {user.details.middleName}{" "}
            {user.details.lastName}
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            {user.details.email}
          </Typography>

          {/* Company Information */}
          {user.company && (
            <Typography variant="body2" align="center" color="textSecondary">
              Company: {user.company.companyName}
            </Typography>
          )}

          {/* Roles
          <Box textAlign="center" mt={2}>
            {user.roles?.map((role, index) => (
              <Chip key={index} label={role} sx={{ m: 0.5 }} />
            ))}
          </Box> */}

          <Divider sx={{ my: 3 }} />

          {/* Enrolled Courses */}
          <Typography variant="h6" gutterBottom>
            Enrolled Courses
          </Typography>
          <List>
            {user.enrolledCourses?.map((course) => (
              <ListItem key={course.courseId}>
                <ListItemText
                  primary={course.courseName}
                  secondary={`Enrolled on: ${new Date(
                    course.enrolledAt
                  ).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Documents */}
          <Typography variant="h6" gutterBottom>
            Uploaded Documents
          </Typography>
          <List>
            {user.documents?.map((doc) => (
              <ListItem key={doc.id}>
                <ListItemText
                  primary={doc.documentType}
                  secondary={`Uploaded on: ${new Date(
                    doc.uploadedAt
                  ).toLocaleDateString()}`}
                />
                <a
                  href={doc.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Certificates */}
          <Typography variant="h6" gutterBottom>
            Certificates
          </Typography>
          <List>
            {user.certificates?.map((cert) => (
              <ListItem key={cert.id}>
                <ListItemText
                  primary="Certificate"
                  secondary={`Issued: ${new Date(
                    cert.issuedAt
                  ).toLocaleDateString()} | Expiry: ${new Date(
                    cert.expirationDate
                  ).toLocaleDateString()}`}
                />
                <a
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}
