import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Collapse,
  CircularProgress,
} from "@mui/material";
import {
  Description as DocumentIcon,
  Upload as UploadIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { Document } from "../utils/types/types";
import { useDocumentUpload } from "../hooks/useDocumentUpload";
import { useDocumentTypes } from "../hooks/useDocumentTypes";
import DocumentUploadForm from "./document/DocumentUploadForm";
import DocumentList from "./document/DocumentList";
import MissingDocumentsAlert from "./document/MissingDocumentsAlert";
import EmptyDocumentsMessage from "./document/EmptyDocumentsMessage";

interface DocumentsSectionProps {
  documents: Document[];
  userId: string | number;
  onUploadSuccess: () => void;
  hasMissingDocuments?: boolean;
  missingDocTypes?: string[];
  isLoading?: boolean;
  courseType?: string | null;
  isAdminMode?: boolean; // Add admin mode flag
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  userId,
  onUploadSuccess,
  hasMissingDocuments = false,
  missingDocTypes = [],
  isLoading = false,
  courseType = null,
  isAdminMode = false, // Default to user mode
}) => {
  // State for collapsible uploader
  const [uploaderOpen, setUploaderOpen] = useState(
    isAdminMode || hasMissingDocuments
  );

  // Get document types filtered by course type
  const docTypes = useDocumentTypes(missingDocTypes, courseType);

  // Document upload logic
  const {
    fileInputs,
    uploading,
    error,
    success,
    selectedFilesCount,
    handleFileChange,
    handleRemoveFile,
    handleUpload,
    resetFiles,
    resetMessages,
  } = useDocumentUpload(() => {
    onUploadSuccess();
    // Close the uploader after successful upload, but not in admin mode
    if (!isAdminMode) {
      setTimeout(() => setUploaderOpen(false), 2000);
      // Reset files after successful upload
      setTimeout(() => resetFiles(), 2200);
    } else {
      // Just reset files in admin mode, keep uploader open
      setTimeout(() => resetFiles(), 1000);
    }
  });

  // Update uploader visibility when hasMissingDocuments changes
  useEffect(() => {
    if (!isAdminMode) {
      setUploaderOpen(hasMissingDocuments);
    }
  }, [hasMissingDocuments, isAdminMode]);

  // Toggle uploader visibility
  const toggleUploader = () => {
    setUploaderOpen(!uploaderOpen);
    // Clear messages when closing
    if (uploaderOpen) {
      resetMessages();
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
      {/* Admin Mode Indicator */}
      {isAdminMode && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            alignItems: "center",
            bgcolor: "primary.light",
            color: "primary.contrastText",
            fontSize: "0.75rem",
            px: 1,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          <AdminIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Админ режим
        </Box>
      )}

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
          Документи{courseType ? ` за ${courseType}` : ""}
        </Typography>

        <Button
          variant="outlined"
          color={isAdminMode ? "secondary" : "primary"}
          startIcon={<UploadIcon />}
          endIcon={uploaderOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
          onClick={toggleUploader}
        >
          {uploaderOpen ? "Скрий формата" : "Качи документи"}
        </Button>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography>Проверка на необходимите документи...</Typography>
        </Box>
      )}

      {/* Missing Documents Alert */}
      {!isLoading && hasMissingDocuments && !isAdminMode && (
        <MissingDocumentsAlert
          missingDocTypes={missingDocTypes}
          docTypes={docTypes}
          uploaderOpen={uploaderOpen}
          onOpenUploader={() => setUploaderOpen(true)}
        />
      )}

      {/* Document Uploader (Collapsible) */}
      <Collapse in={uploaderOpen} timeout="auto" unmountOnExit>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: isAdminMode
              ? "background.paper"
              : "background.default",
            borderRadius: 2,
            borderColor: isAdminMode ? "secondary.main" : "divider",
          }}
        >
          {docTypes.length > 0 ? (
            <DocumentUploadForm
              docTypes={docTypes}
              fileInputs={fileInputs}
              uploading={uploading}
              error={error}
              success={success}
              selectedFilesCount={selectedFilesCount}
              missingDocTypes={missingDocTypes}
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
              onUpload={() => handleUpload(userId, docTypes)}
              isAdminMode={isAdminMode}
            />
          ) : (
            <Typography>
              Няма документи, които трябва да качите за този курс.
            </Typography>
          )}
        </Paper>
      </Collapse>

      {/* Existing Documents List or Empty State Message */}
      {documents?.length > 0 ? (
        <DocumentList
          documents={documents}
          isAdminMode={isAdminMode}
          userId={userId}
          onDocumentDeleted={onUploadSuccess}
        />
      ) : (
        <EmptyDocumentsMessage
          uploaderOpen={uploaderOpen}
          onOpenUploader={() => setUploaderOpen(true)}
        />
      )}
    </Paper>
  );
};

export default DocumentsSection;
