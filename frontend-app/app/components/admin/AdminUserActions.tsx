import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  LockReset as ResetPasswordIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { adminResetUserPassword, suspendUser } from "@/app/utils/apis/admin";

interface AdminUserActionsProps {
  userId: number;
  userEmail: string;
  onActionComplete: () => void;
}

export default function AdminUserActions({
  userId,
  userEmail,
  onActionComplete,
}: AdminUserActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<
    "reset" | "suspend" | "delete" | "email"
  >("reset");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = (
    action: "reset" | "suspend" | "delete" | "email"
  ) => {
    setActionType(action);
    setDialogOpen(true);
    handleClose();
    setError(null);
    setSuccess(null);

    // Set default password for reset action
    if (action === "reset") {
      setResetPasswordValue(generateRandomPassword(10));
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setError(null);
    setSuccess(null);
  };

  const generateRandomPassword = (length: number) => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleAction = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      switch (actionType) {
        case "reset":
          const resetResponse = await adminResetUserPassword(
            userId,
            resetPasswordValue
          );
          if (resetResponse.success) {
            setSuccess(
              `Паролата е успешно променена на: ${resetPasswordValue}`
            );
            onActionComplete();
          } else {
            setError(resetResponse.error || "Грешка при смяна на паролата");
          }
          break;

        case "suspend":
          const suspendResponse = await suspendUser(userId);
          if (suspendResponse.success) {
            setSuccess("Потребителят е успешно деактивиран");
            onActionComplete();
          } else {
            setError(suspendResponse.error || "Грешка при деактивиране");
          }
          break;

        case "delete":
          // Handle delete user - typically would be a soft delete
          setSuccess("User deletion is currently disabled");
          break;

        case "email":
          // Handle send email to user
          setSuccess(
            `Email would be sent to ${userEmail} (functionality not implemented)`
          );
          break;
      }
    } catch (err) {
      setError("Unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderDialogContent = () => {
    switch (actionType) {
      case "reset":
        return (
          <>
            <DialogContentText>
              Въведете новата парола за потребителя или използвайте автоматично
              генерираната.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Нова парола"
              type="text"
              fullWidth
              value={resetPasswordValue}
              onChange={(e) => setResetPasswordValue(e.target.value)}
              variant="outlined"
            />
          </>
        );

      case "suspend":
        return (
          <DialogContentText>
            Деактивираният потребител няма да може да влиза в системата, докато
            не бъде активиран отново.
          </DialogContentText>
        );

      case "delete":
        return (
          <DialogContentText color="error">
            Това действие не може да бъде отменено. Всички данни на потребителя
            ще бъдат изтрити.
          </DialogContentText>
        );

      case "email":
        return (
          <>
            <DialogContentText>
              Изпратете директно съобщение до {userEmail}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Тема"
              type="text"
              fullWidth
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Съдържание"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              variant="outlined"
            />
          </>
        );
    }
  };

  const getDialogTitle = () => {
    switch (actionType) {
      case "reset":
        return "Смяна на парола";
      case "suspend":
        return "Деактивиране на потребител";
      case "delete":
        return "Изтриване на потребител";
      case "email":
        return "Изпращане на имейл";
    }
  };

  const getActionButtonText = () => {
    switch (actionType) {
      case "reset":
        return "Смени паролата";
      case "suspend":
        return "Деактивирай";
      case "delete":
        return "Изтрий";
      case "email":
        return "Изпрати";
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<MoreVertIcon />}
        onClick={handleClick}
        aria-controls="admin-user-actions-menu"
        aria-haspopup="true"
      >
        Действия
      </Button>

      <Menu
        id="admin-user-actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleDialogOpen("reset")}>
          <ListItemIcon>
            <ResetPasswordIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Смяна на парола" />
        </MenuItem>

        <MenuItem onClick={() => handleDialogOpen("suspend")}>
          <ListItemIcon>
            <BlockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Деактивирай" />
        </MenuItem>

        <MenuItem onClick={() => handleDialogOpen("email")}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Изпрати имейл" />
        </MenuItem>

        <MenuItem onClick={() => handleDialogOpen("delete")} disabled>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Изтрий потребител" />
        </MenuItem>
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{getDialogTitle()}</DialogTitle>
        <DialogContent>
          {renderDialogContent()}

          {error && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {success && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="success">{success}</Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={loading}>
            Отказ
          </Button>
          <Button
            onClick={handleAction}
            color="primary"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Изпълнение..." : getActionButtonText()}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
