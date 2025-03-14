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
  courseType?: string | null; // Added courseType prop
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  userId,
  onUploadSuccess,
  hasMissingDocuments = false,
  missingDocTypes = [],
  isLoading = false,
  courseType = null, // Default to null
}) => {
  // State for collapsible uploader
  const [uploaderOpen, setUploaderOpen] = useState(hasMissingDocuments);

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
    // Close the uploader after successful upload
    setTimeout(() => setUploaderOpen(false), 2000);
    // Reset files after successful upload
    setTimeout(() => resetFiles(), 2200);
  });

  // Update uploader visibility when hasMissingDocuments changes
  useEffect(() => {
    setUploaderOpen(hasMissingDocuments);
  }, [hasMissingDocuments]);

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
          color="primary"
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
      {!isLoading && hasMissingDocuments && (
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
            backgroundColor: "background.default",
            borderRadius: 2,
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
        <DocumentList documents={documents} />
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
