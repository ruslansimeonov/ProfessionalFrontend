import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  AttachFile as AttachIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { Document } from "../../utils/types/types";
import { getDocumentIcon, formatDate } from "../../utils/documentUtils";
import { deleteUserDocument } from "../../utils/apis/documents";

interface DocumentListProps {
  documents: Document[];
  isAdminMode?: boolean;
  userId?: string | number;
  onDocumentDeleted?: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isAdminMode = false,
  userId,
  onDocumentDeleted,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleOpenDeleteDialog = (document: Document) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteError(null);
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocument || !userId) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      const response = await deleteUserDocument(
        String(userId),
        selectedDocument.id
      );

      if (response.success) {
        if (onDocumentDeleted) {
          onDocumentDeleted();
        }
        handleCloseDeleteDialog();
      } else {
        setDeleteError(
          response.message || "Грешка при изтриването на документа"
        );
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      setDeleteError("Възникна грешка при изтриването на документа");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ fontWeight: "medium", mb: 1 }}
        >
          {isAdminMode
            ? "Качени документи на потребителя:"
            : "Вашите качени документи:"}
        </Typography>
        <Paper variant="outlined">
          <List dense disablePadding>
            {documents.map((doc, index) => (
              <React.Fragment key={doc.id || index}>
                {index > 0 && <Divider component="li" />}
                <ListItem
                  sx={{
                    py: 1,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                  secondaryAction={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Tooltip title="Отвори документа">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => window.open(doc.url, "_blank")}
                        >
                          <OpenIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {isAdminMode && (
                        <Tooltip title="Изтрий документа">
                          <IconButton
                            edge="end"
                            size="small"
                            sx={{ ml: 1, color: "error.main" }}
                            onClick={() => handleOpenDeleteDialog(doc)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getDocumentIcon(doc.documentType, doc.url)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        component="div"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{ fontWeight: "medium" }}
                        >
                          {doc.documentType || "Документ"}
                        </Typography>
                        {isAdminMode && (
                          <Tooltip title="Админ режим">
                            <AdminIcon
                              fontSize="small"
                              sx={{
                                ml: 1,
                                color: "secondary.main",
                                fontSize: 16,
                              }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" component="span">
                        Качен на: {formatDate(doc.createdAt)}
                      </Typography>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Deletion confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Потвърдете изтриване</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Наистина ли искате да изтриете документа{" "}
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {selectedDocument?.documentType || "Неизвестен документ"}
            </Box>
            ?
            <Box component="div" sx={{ mt: 1, fontStyle: "italic" }}>
              Това действие не може да бъде отменено.
            </Box>
          </DialogContentText>

          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            color="inherit"
            disabled={isDeleting}
          >
            Отказ
          </Button>
          <Button
            onClick={handleDeleteDocument}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={
              isDeleting ? <CircularProgress size={18} /> : <DeleteIcon />
            }
          >
            {isDeleting ? "Изтриване..." : "Изтрий"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocumentList;
