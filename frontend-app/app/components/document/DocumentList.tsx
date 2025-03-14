import React from "react";
import {
  Typography,
  List,
  ListItem,
  Box,
  Button,
  Tooltip,
} from "@mui/material";
import { CloudDownload as DownloadIcon } from "@mui/icons-material";
import { Document } from "../../utils/types/types";
import {
  getDocumentIcon,
  formatDate,
  getDocumentDescription,
} from "../../utils/documentUtils";

interface DocumentListProps {
  documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  if (!documents?.length) {
    return null;
  }

  return (
    <>
      <Typography variant="subtitle1" component="div" sx={{ mb: 2 }}>
        Качени документи:
      </Typography>
      <List sx={{ p: 0 }}>
        {documents.map((doc) => {
          if (!doc) return null;

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
                    {getDocumentIcon(doc.documentType, doc.documentUrl || "")}
                  </Box>

                  <Box sx={{ ml: 1 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
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
  );
};

export default DocumentList;
