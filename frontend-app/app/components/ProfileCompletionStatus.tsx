import React from "react";
import {
  Alert,
  AlertTitle,
  Box,
  LinearProgress,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

interface ProfileCompletionStatusProps {
  isMissingPersonalInfo: boolean;
  hasMissingDocuments: boolean;
  missingDocTypes: string[];
  completedSteps: number;
  isLoading?: boolean;
}

const ProfileCompletionStatus: React.FC<ProfileCompletionStatusProps> = ({
  isMissingPersonalInfo,
  hasMissingDocuments,
  missingDocTypes,
  completedSteps,
  isLoading = false,
}) => {
  // Calculate completion percentage (0, 50%, or 100%)
  const completionPercentage = (completedSteps / 2) * 100;

  // If everything is complete, don't show the alert
  if (!isMissingPersonalInfo && !hasMissingDocuments && !isLoading) {
    return null;
  }

  return (
    <Alert
      severity={completedSteps === 0 ? "error" : "warning"}
      sx={{ mb: 3, mt: 2 }}
    >
      <AlertTitle>Profile Completion</AlertTitle>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          {completedSteps === 0
            ? "Your profile is incomplete. Please complete the following steps:"
            : "You're almost there! Please complete the remaining steps:"}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={completionPercentage}
          color={completedSteps === 0 ? "error" : "warning"}
          sx={{ mt: 1, mb: 2 }}
        />
      </Box>

      <List dense disablePadding>
        {/* Personal Information Status */}
        <ListItem disableGutters>
          <ListItemIcon sx={{ minWidth: 36 }}>
            {isMissingPersonalInfo ? (
              <ErrorIcon color="error" fontSize="small" />
            ) : (
              <CheckCircleIcon color="success" fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              isMissingPersonalInfo
                ? "Complete your personal information"
                : "Personal information completed ✓"
            }
            primaryTypographyProps={{
              variant: "body2",
              fontWeight: isMissingPersonalInfo ? "bold" : "normal",
            }}
          />
        </ListItem>

        {/* Document Status */}
        <ListItem disableGutters>
          <ListItemIcon sx={{ minWidth: 36 }}>
            {isLoading ? (
              <CircularProgress size={20} />
            ) : hasMissingDocuments ? (
              <ErrorIcon color="error" fontSize="small" />
            ) : (
              <CheckCircleIcon color="success" fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              isLoading
                ? "Checking required documents..."
                : hasMissingDocuments
                ? "Upload required documents"
                : "All required documents uploaded ✓"
            }
            primaryTypographyProps={{
              variant: "body2",
              fontWeight: hasMissingDocuments ? "bold" : "normal",
            }}
          />
        </ListItem>

        {/* Show missing document types if any */}
        {!isLoading && hasMissingDocuments && missingDocTypes.length > 0 && (
          <Box sx={{ pl: 4, mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Missing documents:
            </Typography>
            <List dense disablePadding>
              {missingDocTypes.map((docType, index) => (
                <ListItem key={index} disableGutters sx={{ pl: 1 }}>
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <WarningIcon fontSize="inherit" color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={docType}
                    primaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </List>
    </Alert>
  );
};

export default ProfileCompletionStatus;
