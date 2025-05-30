import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

interface FormDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  isValid?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  children: React.ReactNode;
}

export default function FormDialog({
  open,
  title,
  onClose,
  onSubmit,
  isLoading = false,
  isValid = true,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          {children}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelLabel}</Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={isLoading || !isValid}
        >
          {isLoading ? <CircularProgress size={24} /> : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
