import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";

interface EmptyDocumentsMessageProps {
  uploaderOpen: boolean;
  onOpenUploader: () => void;
}

const EmptyDocumentsMessage: React.FC<EmptyDocumentsMessageProps> = ({
  uploaderOpen,
  onOpenUploader,
}) => {
  return (
    <Box sx={{ textAlign: "center", py: 3, mb: !uploaderOpen ? 2 : 0 }}>
      <Typography variant="body1" color="text.secondary" component="div">
        Все още нямате качени документи.
      </Typography>
      {!uploaderOpen && (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UploadIcon />}
          onClick={onOpenUploader}
          sx={{ mt: 2 }}
        >
          Качете първия си документ
        </Button>
      )}
    </Box>
  );
};

export default EmptyDocumentsMessage;
