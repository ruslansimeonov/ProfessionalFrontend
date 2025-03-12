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
  AlertTitle,
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
  Upload as UploadIcon,
  AttachFile as AttachIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { Document } from "../utils/types/types";
import { uploadUserDocuments } from "@/app/utils/apis/api";

interface DocumentsSectionProps {
  documents: Document[];
  userId: string | number;
  onUploadSuccess: () => void;
  hasMissingDocuments?: boolean;
  missingDocTypes?: string[];
}

interface DocType {
  name: string;
  label: string;
  required: boolean;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  userId,
  onUploadSuccess,
  hasMissingDocuments = false,
  missingDocTypes = [],
}) => {
  // State for collapsible uploader
  const [uploaderOpen, setUploaderOpen] = useState(hasMissingDocuments);
  const [fileInputs, setFileInputs] = useState<{
    [docType: string]: File | null;
  }>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Document types with required flag
  const docTypes: DocType[] = [
    {
      name: "DiplomaCopy",
      label: "Диплома за завършено образование",
      required: true,
    },
    { name: "DriverLicense", label: "Шофьорска книжка", required: true },
    {
      name: "MedicalCertificateGeneral",
      label: "Медицинско удостоверение от личен лекар",
      required: true,
    },
    {
      name: "PassportPhotos",
      label: "Снимки паспортен формат",
      required: true,
    },
    {
      name: "PsychiatricCertificate",
      label: "Психиатрично удостоверение",
      required: false,
    },
    {
      name: "ExistingLicenseCopy",
      label: "Съществуваща валидна лицензия",
      required: false,
    },
    {
      name: "MedicalCertificateRefresher",
      label: "Медицинско удостоверение за опреснителен курс",
      required: false,
    },
  ];

  // Check if a specific document type is missing
  const isDocTypeMissing = (docType: string): boolean => {
    return missingDocTypes.some((missingType) =>
      docType.toLowerCase().includes(missingType.toLowerCase())
    );
  };

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
      setError("Моля, изберете поне един файл за качване.");
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
        setSuccess("Документите са качени успешно!");
        // Clear selected files
        setFileInputs({});
        // Notify parent component
        onUploadSuccess();
        // Close the uploader after successful upload
        setTimeout(() => setUploaderOpen(false), 2000);
      } else {
        setError(`Грешка при качване: ${response.error}`);
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      setError("Възникна грешка при качване на документи.");
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
      const fileExtension = url?.split(".").pop()?.toLowerCase();
      if (fileExtension === "pdf") {
        return <PdfIcon color="error" />;
      } else if (
        ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "")
      ) {
        return <ImageIcon color="primary" />;
      } else {
        return <FileIcon color="action" />;
      }
    }

    if (
      documentType.toLowerCase().includes("id") ||
      documentType.toLowerCase().includes("passport") ||
      documentType.toLowerCase().includes("license")
    ) {
      return <VerifiedIcon color="info" />;
    }

    const fileExtension = url?.split(".").pop()?.toLowerCase();
    if (fileExtension === "pdf") {
      return <PdfIcon color="error" />;
    } else if (
      ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "")
    ) {
      return <ImageIcon color="primary" />;
    }

    return <FileIcon color="action" />;
  };

  // Format date to be more readable
  const formatDate = (dateString: Date | string | undefined): string => {
    if (!dateString) return "Неизвестна дата";

    try {
      return new Date(dateString).toLocaleDateString("bg-BG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Невалидна дата";
    }
  };

  // Get document type description
  const getDocumentDescription = (documentType: string | undefined): string => {
    if (!documentType) return "Документ";

    const documentTypes: Record<string, string> = {
      diploma: "Диплома за завършено образование",
      driver: "Шофьорска книжка",
      medical: "Медицинско удостоверение",
      photo: "Снимки паспортен формат",
      psychiatric: "Психиатрично удостоверение",
      license: "Лицензия",
      passport: "Паспорт",
    };

    // Try to match the document type with known types
    for (const [key, description] of Object.entries(documentTypes)) {
      if (documentType.toLowerCase().includes(key)) {
        return description;
      }
    }

    return "Документ";
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
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        border: hasMissingDocuments ? "1px solid" : "none",
        borderColor: "warning.main",
        position: "relative",
      }}
    >
      {/* Document Section Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <DocumentIcon sx={{ mr: 1 }} />
          Документи
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<UploadIcon />}
          endIcon={uploaderOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
          onClick={toggleUploader}
        >
          {uploaderOpen ? "Скрий формата" : "Качи документи"}
        </Button>
      </Box>

      {/* Missing Documents Alert */}
      {hasMissingDocuments && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>
            <strong>Необходимо е да качите задължителните документи</strong>
          </AlertTitle>
          <Typography component="div" variant="body2">
            За да завършите процеса на регистрация, моля качете следните
            документи:
            <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
              {missingDocTypes.map((docType, index) => (
                <li key={index}>
                  <Typography component="span" variant="body2">
                    {docTypes.find((dt) =>
                      dt.name.toLowerCase().includes(docType.toLowerCase())
                    )?.label || docType}
                  </Typography>
                </li>
              ))}
            </ul>
          </Typography>
          {!uploaderOpen && (
            <Button
              variant="contained"
              color="warning"
              size="small"
              sx={{ mt: 1 }}
              onClick={() => setUploaderOpen(true)}
              startIcon={<UploadIcon />}
            >
              Качи сега
            </Button>
          )}
        </Alert>
      )}

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
          <Typography
            variant="body2"
            gutterBottom
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Изберете файлове за качване за следните типове документи:
          </Typography>

          <Grid container spacing={2}>
            {docTypes.map(({ name, label, required }) => {
              const isMissing = required && isDocTypeMissing(name);

              return (
                <Grid item xs={12} sm={6} key={name}>
                  <Card
                    variant="outlined"
                    sx={{
                      mb: 1,
                      position: "relative",
                      borderColor: fileInputs[name]
                        ? "success.main"
                        : isMissing
                        ? "warning.main"
                        : "divider",
                      bgcolor: isMissing ? "warning.50" : "background.paper",
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
                          fontWeight: isMissing ? "bold" : "medium",
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          color: isMissing ? "warning.dark" : "text.primary",
                        }}
                      >
                        {isMissing ? (
                          <ErrorIcon
                            sx={{ mr: 1, fontSize: 18, color: "warning.main" }}
                          />
                        ) : (
                          <AttachIcon sx={{ mr: 1, fontSize: 18 }} />
                        )}
                        {label}
                        {required && (
                          <Typography
                            component="span"
                            variant="caption"
                            color={
                              isMissing ? "warning.dark" : "text.secondary"
                            }
                            sx={{ ml: 1 }}
                          >
                            *
                          </Typography>
                        )}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Button
                          variant={
                            fileInputs[name]
                              ? "outlined"
                              : isMissing
                              ? "contained"
                              : "outlined"
                          }
                          size="small"
                          component="label"
                          startIcon={fileInputs[name] ? <CheckIcon /> : null}
                          sx={{ flexGrow: 0 }}
                          color={
                            fileInputs[name]
                              ? "success"
                              : isMissing
                              ? "warning"
                              : "primary"
                          }
                        >
                          {fileInputs[name] ? "Избран" : "Избери файл"}
                          <input
                            type="file"
                            hidden
                            onChange={(e) => handleFileChange(e, name)}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          />
                        </Button>

                        {fileInputs[name] && (
                          <>
                            <Tooltip title="Премахни файла">
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
              );
            })}
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Chip
              label={`${selectedFilesCount} файл${
                selectedFilesCount !== 1 ? "а" : ""
              } избран${selectedFilesCount !== 1 ? "и" : ""}`}
              color={selectedFilesCount > 0 ? "primary" : "default"}
              variant={selectedFilesCount > 0 ? "filled" : "outlined"}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={selectedFilesCount === 0 || uploading}
              startIcon={
                uploading ? <CircularProgress size={20} /> : <UploadIcon />
              }
            >
              {uploading ? "Качване..." : "Качи избраните файлове"}
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
        <>
          <Typography variant="subtitle1" component="div" sx={{ mb: 2 }}>
            Качени документи:
          </Typography>
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
                        {getDocumentIcon(
                          doc.documentType,
                          doc.documentUrl || ""
                        )}
                      </Box>

                      <Box sx={{ ml: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ mr: 1 }}
                          >
                            {getDocumentDescription(doc.documentType)}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="div"
                        >
                          Качен на: {formatDate(doc.uploadedAt)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      {doc.documentUrl && (
                        <Tooltip title="Преглед на документа">
                          <Button
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                          >
                            Преглед
                          </Button>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </>
      ) : (
        <Box sx={{ textAlign: "center", py: 3, mb: !uploaderOpen ? 2 : 0 }}>
          <Typography variant="body1" color="text.secondary" component="div">
            Все още нямате качени документи.
          </Typography>
          {!uploaderOpen && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<UploadIcon />}
              onClick={toggleUploader}
              sx={{ mt: 2 }}
            >
              Качете първия си документ
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default DocumentsSection;
