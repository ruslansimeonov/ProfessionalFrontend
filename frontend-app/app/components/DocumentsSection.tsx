import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Box,
  Tooltip,
  Grid,
  Grid2,
} from "@mui/material";
import {
  Description as DocumentIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  CloudDownload as DownloadIcon,
} from "@mui/icons-material";
import { Document } from "../utils/types/types";

interface DocumentsSectionProps {
  documents: Document[];
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents }) => {
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
    if (!dateString) return "Unknown date";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid date";
    }
  };

  // Get document type description
  const getDocumentDescription = (documentType: string | undefined): string => {
    if (!documentType) return "Supporting document";

    const documentTypes: Record<string, string> = {
      id_card: "National identity card",
      passport: "International passport",
      drivers_license: "Driver's license",
      diploma: "Educational diploma or degree",
      certificate: "Professional certificate",
      application_form: "Course application form",
      medical: "Medical certificate",
      contract: "Signed contract",
      receipt: "Payment receipt",
      cv: "Curriculum Vitae",
    };

    // Try to match the document type with known types
    for (const [key, description] of Object.entries(documentTypes)) {
      if (
        documentType.toLowerCase().includes(key.replace("_", " ")) ||
        documentType.toLowerCase().includes(key)
      ) {
        return description;
      }
    }

    return "Supporting document";
  };

  // Debug the documents
  console.log("Documents to display:", documents);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        <DocumentIcon sx={{ mr: 1 }} />
        Your Documents
      </Typography>

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
                <Grid2 container spacing={1} alignItems="center">
                  <Grid2 size={{ xs: 12, md: 7 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {getDocumentIcon(
                          doc.documentType,
                          doc.documentUrl || ""
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="subtitle1" sx={{ mr: 1 }}>
                              {doc.documentType || "Document"}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {getDocumentDescription(doc.documentType)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Uploaded: {formatDate(doc.uploadedAt)}
                            </Typography>
                          </>
                        }
                      />
                    </Box>
                  </Grid2>

                  <Grid2
                    size={{ xs: 12, md: 5 }}
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "flex-start", sm: "flex-end" },
                    }}
                  >
                    {doc.documentUrl && (
                      <Tooltip title="View Document">
                        <Button
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          sx={{ mr: 1 }}
                        >
                          View
                        </Button>
                      </Tooltip>
                    )}
                  </Grid2>
                </Grid2>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No documents uploaded yet.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default DocumentsSection;
