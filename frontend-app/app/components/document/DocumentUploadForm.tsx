import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Divider,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Upload as UploadIcon,
  AttachFile as AttachIcon,
  Error as ErrorIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { DocType } from "../../hooks/useDocumentUpload";
import { isDocTypeMissing } from "../../utils/documentUtils";

interface DocumentUploadFormProps {
  docTypes: DocType[];
  fileInputs: { [docType: string]: File | null };
  uploading: boolean;
  error: string | null;
  success: string | null;
  selectedFilesCount: number;
  missingDocTypes: string[];
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: string
  ) => void;
  onRemoveFile: (docType: string) => void;
  onUpload: () => void;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  docTypes,
  fileInputs,
  uploading,
  error,
  success,
  selectedFilesCount,
  missingDocTypes,
  onFileChange,
  onRemoveFile,
  onUpload,
}) => {
  return (
    <>
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
          const isMissing = required && isDocTypeMissing(name, missingDocTypes);

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
                        color={isMissing ? "warning.dark" : "text.secondary"}
                        sx={{ ml: 1 }}
                      >
                        *
                      </Typography>
                    )}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                        onChange={(e) => onFileChange(e, name)}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </Button>

                    {fileInputs[name] && (
                      <>
                        <Tooltip title="Премахни файла">
                          <IconButton
                            size="small"
                            onClick={() => onRemoveFile(name)}
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
          onClick={onUpload}
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
    </>
  );
};

export default DocumentUploadForm;
