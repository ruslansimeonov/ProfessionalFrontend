import React, { useState, ChangeEvent } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  Box,
  Chip,
  Tooltip,
  Button,
  Collapse,
  Divider,
  CardContent,
  Card,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Description as DocumentIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  CloudDownload as DownloadIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  Upload as UploadIcon,
  ExpandMore as ExpandMoreIcon,
  AttachFile as AttachIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
} from "@mui/icons-material";
import { Document } from "../utils/types/types";
import { uploadUserDocuments } from "@/app/utils/apis/api";

interface DocumentsSectionProps {
  documents: Document[];
  userId: string | number;
  onUploadSuccess: () => void;
}

interface DocType {
  name: string;
  label: string;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ 
  documents, 
  userId, 
  onUploadSuccess 
}) => {
  // State for collapsible uploader
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [fileInputs, setFileInputs] = useState<{ [docType: string]: File | null }>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        // Close the uploader after successful upload
        setTimeout(() => setUploaderOpen(false), 2000);
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
  
  // Get appropriate icon based on document type or file extension
  const getDocumentIcon = (documentType: string | undefined, url: string) => {
    // Default icon if documentType is undefined
    if (!documentType) {
      const fileExtension = url?.split('.').pop()?.toLowerCase();
      if (fileExtension === 'pdf') {
        return <PdfIcon color="error" />;
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '')) {
        return <ImageIcon color="primary" />;
      } else {
        return <FileIcon color="action" />;
      }
    }
    
    if (documentType.toLowerCase().includes('id') || 
        documentType.toLowerCase().includes('passport') ||
        documentType.toLowerCase().includes('license')) {
      return <VerifiedIcon color="info" />;
    }
    
    const fileExtension = url?.split('.').pop()?.toLowerCase();
    if (fileExtension === 'pdf') {
      return <PdfIcon color="error" />;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '')) {
      return <ImageIcon color="primary" />;
    }
    
    return <FileIcon color="action" />;
  };

  // Format date to be more readable
  const formatDate = (dateString: Date | string | undefined): string => {
    if (!dateString) return 'Unknown date';
    
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };

  // Get document type description
  const getDocumentDescription = (documentType: string | undefined): string => {
    if (!documentType) return 'Supporting document';
    
    const documentTypes: Record<string, string> = {
      'id_card': 'National identity card',
      'passport': 'International passport',
      'drivers_license': "Driver's license",
      'diploma': 'Educational diploma or degree',
      'certificate': 'Professional certificate',
      'application_form': 'Course application form',
      'medical': 'Medical certificate',
      'contract': 'Signed contract',
      'receipt': 'Payment receipt',
      'cv': 'Curriculum Vitae',
    };

    // Try to match the document type with known types
    for (const [key, description] of Object.entries(documentTypes)) {
      if (documentType.toLowerCase().includes(key.replace('_', ' ')) || 
          documentType.toLowerCase().includes(key)) {
        return description;
      }
    }

    return 'Supporting document';
  };

  // Get status chip based on document verification
  const getStatusChip = (isActive: boolean | undefined) => {
    return isActive ? (
      <Chip 
        icon={<VerifiedIcon fontSize="small" />}
        label="Verified" 
        color="success" 
        size="small"
      />
    ) : (
      <Chip 
        icon={<WarningIcon fontSize="small" />}
        label="Pending" 
        color="warning" 
        size="small" 
      />
    );
  };

  // Toggle uploader visibility
  const toggleUploader = () => {
    setUploaderOpen(!uploaderOpen);
    // Clear messages when closing
    if (uploaderOpen) {
      setError(null);
      setSuccess(null);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      {/* Document Section Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <DocumentIcon sx={{ mr: 1 }} />
          Your Documents
        </Typography>
        
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UploadIcon />}
          endIcon={uploaderOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
          onClick={toggleUploader}
        >
          {uploaderOpen ? "Hide Uploader" : "Upload New Documents"}
        </Button>
      </Box>

      {/* Document Uploader (Collapsible) */}
      <Collapse in={uploaderOpen} timeout="auto" unmountOnExit>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: "background.default",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
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
                      component="div"
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
                            component="div"
                            color="text.secondary"
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

          <Divider sx={{ my: 2 }} />

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
      </Collapse>

      {/* Existing Documents List */}
      {documents?.length > 0 ? (
        <List sx={{ p: 0 }}>
          {documents.map((doc) => {
            // Extra safety check for malformed document objects
            if (!doc) {
              console.warn("Found undefined document in array");
              return null;
            }

            return (
              <ListItem
                key={doc.id || `doc-${Math.random()}`}
                sx={{
                  borderLeft: "4px solid",
                  borderColor: doc.isActive ? "success.main" : "primary.main",
                  pl: 2,
                  mb: 1.5,
                  backgroundColor: "background.paper",
                  borderRadius: "0 4px 4px 0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Box sx={{ display: "flex", width: "100%" }}>
                  <Box sx={{ display: "flex", flexGrow: 1 }}>
                    <Box sx={{ minWidth: 40 }}>
                      {getDocumentIcon(doc.documentType, doc.documentUrl || '')}
                    </Box>
                    
                    <Box sx={{ ml: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                        <Typography variant="subtitle1" component="div" sx={{ mr: 1 }}>
                          {doc.documentType || 'Document'}
                        </Typography>
                        {getStatusChip(doc.isActive)}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" component="div">
                        {getDocumentDescription(doc.documentType)}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" component="div">
                        Uploaded: {formatDate(doc.uploadedAt)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    {doc.documentUrl && (
                      <Tooltip title="View Document">
                        <Button
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                        >
                          View
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Box sx={{ textAlign: "center", py: 3, mb: !uploaderOpen ? 2 : 0 }}>
          <Typography variant="body1" color="text.secondary" component="div">
            No documents uploaded yet.
          </Typography>
          {!uploaderOpen && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<UploadIcon />}
              onClick={toggleUploader}
              sx={{ mt: 2 }}
            >
              Upload Your First Document
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default DocumentsSection;