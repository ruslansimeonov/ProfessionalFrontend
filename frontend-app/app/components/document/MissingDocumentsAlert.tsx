import React from "react";
import { Alert, AlertTitle, Typography, Button } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { DocType } from "../../hooks/useDocumentUpload";

interface MissingDocumentsAlertProps {
  missingDocTypes: string[];
  docTypes: DocType[];
  uploaderOpen: boolean;
  onOpenUploader: () => void;
}

const MissingDocumentsAlert: React.FC<MissingDocumentsAlertProps> = ({
  missingDocTypes,
  docTypes,
  uploaderOpen,
  onOpenUploader,
}) => {
  return (
    <Alert severity="warning" sx={{ mb: 3 }}>
      <AlertTitle>
        <strong>Необходимо е да качите задължителните документи</strong>
      </AlertTitle>
      <Typography component="div" variant="body2">
        За да завършите процеса на регистрация, моля качете следните документи:
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
          onClick={onOpenUploader}
          startIcon={<UploadIcon />}
        >
          Качи сега
        </Button>
      )}
    </Alert>
  );
};

export default MissingDocumentsAlert;
