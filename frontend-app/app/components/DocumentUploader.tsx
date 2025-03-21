import React, { useState, ChangeEvent } from "react";
import {
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AttachFile as AttachIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import { uploadUserDocuments } from "@/app/utils/apis/documents";

interface DocumentUploaderProps {
  userId: string | number;
  onUploadSuccess: () => void;
}

interface DocType {
  name: string;
  label: string;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  userId,
  onUploadSuccess,
}) => {
  // Document types
  const docTypes: DocType[] = [
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

  // State management
  const [fileInputs, setFileInputs] = useState<{
    [docType: string]: File | null;
  }>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    docType: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFileInputs((prev) => ({ ...prev, [docType]: selectedFile }));
    }
  };

  // Remove a selected file
  const handleRemoveFile = (docType: string) => {
    setFileInputs((prev) => ({ ...prev, [docType]: null }));
  };

  // Upload documents
  const handleUpload = async () => {
    setError(null);
    setSuccess(null);
    setUploading(true);

    // Gather files and docTypeNames
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
      setError("Please select at least one file before uploading.");
      setUploading(false);
      return;
    }

    try {
      const response = await uploadUserDocuments({
        userId: String(userId),
        files,
        docTypeNames,
      });
      
      if (response.success) {
        setSuccess("Documents uploaded successfully!");
        // Clear selected files
        setFileInputs({});
        // Notify parent component
        onUploadSuccess();
      } else {
        setError(`Upload failed: ${response.error}`);
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      setError("An error occurred while uploading documents.");
    } finally {
      setUploading(false);
    }
  };

  // Count selected files
  const selectedFilesCount = Object.values(fileInputs).filter(Boolean).length;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        backgroundColor: "background.paper",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        <UploadIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Upload Documents
      </Typography>

      <Typography variant="body2" gutterBottom color="textSecondary" sx={{ mb: 3 }}>
        Select the files for the document types you need to upload:
      </Typography>

      <Grid container spacing={2}>
        {docTypes.map(({ name, label }) => (
          <Grid item xs={12} sm={6} key={name}>
            <Card
              variant="outlined"
              sx={{
                mb: 1,
                position: "relative",
                borderColor: fileInputs[name] ? "success.main" : "divider",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: 1,
                },
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "medium",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AttachIcon sx={{ mr: 1, fontSize: 18 }} />
                  {label}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    variant={fileInputs[name] ? "outlined" : "contained"}
                    size="small"
                    component="label"
                    startIcon={fileInputs[name] ? <CheckIcon /> : null}
                    sx={{ flexGrow: 0 }}
                    color={fileInputs[name] ? "success" : "primary"}
                  >
                    {fileInputs[name] ? "Selected" : "Select File"}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleFileChange(e, name)}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </Button>

                  {fileInputs[name] && (
                    <>
                      <Tooltip title="Remove file">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFile(name)}
                          sx={{ color: "error.main" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{
                          ml: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "120px",
                          display: "inline-block",
                        }}
                      >
                        {fileInputs[name]?.name}
                      </Typography>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Chip
          label={`${selectedFilesCount} file${
            selectedFilesCount !== 1 ? "s" : ""
          } selected`}
          color={selectedFilesCount > 0 ? "primary" : "default"}
          variant={selectedFilesCount > 0 ? "filled" : "outlined"}
        />
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={selectedFilesCount === 0 || uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
        >
          {uploading ? "Uploading..." : "Upload Selected Files"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Paper>
  );
};

export default DocumentUploader;