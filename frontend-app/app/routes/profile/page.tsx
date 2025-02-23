"use client";

import React, { useState, ChangeEvent } from "react";
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
  Button,
} from "@mui/material";
import { useStore } from "@/app/store/useStore";
import { uploadUserDocuments } from "@/app/utils/apis/api";

export default function ProfilePage() {
  const fetchUser = useStore((state) => state.fetchUser);
  const user = useStore((state) => state.user);

  // 1) We fetch the user data on component mount (or each render).
  //    If your store already handles a single fetch, you can remove or condition it.
  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 2) Define the document types (could also come from an API if dynamic)
  const docTypes = [
    { name: "DiplomaCopy", label: "Copy of diploma (min 10th grade)" },
    { name: "DriverLicense", label: "Driver's license copy" },
    { name: "MedicalCertificateGeneral", label: "Medical certificate (GP)" },
    { name: "PsychiatricCertificate", label: "Psychiatric certificate" },
    { name: "PassportPhotos", label: "Two passport-sized photos" },
    { name: "ExistingLicenseCopy", label: "Existing valid license" },
    {
      name: "MedicalCertificateRefresher",
      label: "Medical certificate (refresher)",
    },
  ];

  // 3) Track selected files for each document type
  const [fileInputs, setFileInputs] = useState<{
    [docType: string]: File | null;
  }>({});

  // 4) Handle file selection for each docType
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    docType: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFileInputs((prev) => ({ ...prev, [docType]: selectedFile }));
    }
  };

  // 5) Upload selected documents
  const handleUpload = async () => {
    if (!user) {
      alert("No user found. Please log in.");
      return;
    }

    // Gather the files + docTypeNames arrays in the order they appear
    const files: File[] = [];
    const docTypeNames: string[] = [];

    for (const { name: docTypeName } of docTypes) {
      const file = fileInputs[docTypeName];
      if (file) {
        files.push(file);
        docTypeNames.push(docTypeName);
      }
    }

    if (files.length === 0) {
      alert("Please select at least one file before uploading!");
      return;
    }

    try {
      // user.details.id is your user ID from the store
      const response = await uploadUserDocuments({
        userId: String(user.details.id),
        files,
        docTypeNames,
      });
      if (response.success) {
        alert("Documents uploaded successfully!");
        // Re-fetch user data to see newly uploaded documents
        fetchUser();
      } else {
        alert(`Upload failed: ${response.error}`);
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      alert("An error occurred while uploading documents.");
    }
  };

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

          {/* Uploaded Documents */}
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

          <Divider sx={{ my: 3 }} />

          {/* -- NEW SECTION: UPLOAD DOCUMENTS BY TYPE -- */}
          <Typography variant="h6" gutterBottom>
            Upload Documents
          </Typography>
          <Typography variant="body2" gutterBottom color="textSecondary">
            Select the files for the document types you want to upload:
          </Typography>

          {docTypes.map(({ name, label }) => (
            <Box
              key={name}
              display="flex"
              alignItems="center"
              mt={1}
              mb={1}
              gap={2}
            >
              <Typography sx={{ minWidth: 200 }}>{label}</Typography>
              <Button variant="contained" component="label">
                Select File
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, name)}
                />
              </Button>
              {/* Optionally show the selected file name */}
              {fileInputs[name] && (
                <Typography variant="body2" color="textSecondary">
                  {fileInputs[name]?.name}
                </Typography>
              )}
            </Box>
          ))}

          <Box textAlign="center" mt={2}>
            <Button variant="contained" color="primary" onClick={handleUpload}>
              Upload Selected Files
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
