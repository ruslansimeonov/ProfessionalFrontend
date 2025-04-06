"use client";
import {
  Alert,
  AlertTitle,
  Box,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ErrorOutline} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface ProfileCompletionStatusProps {
  isMissingPersonalInfo: boolean;
  hasMissingDocuments: boolean;
  missingDocTypes: string[];
  completedSteps: number;
  isLoading?: boolean;
}

export default function ProfileCompletionStatus({
  isMissingPersonalInfo,
  hasMissingDocuments,
  completedSteps,
  isLoading = false,
}: ProfileCompletionStatusProps) {
  const { t } = useTranslation(); 

  // If everything is completed, don't show anything
  if (!isMissingPersonalInfo && !hasMissingDocuments) return null;

  // If still loading document requirements, show spinner
  if (isLoading) {
    return (
      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Alert
        severity="warning"
        icon={<ErrorOutline fontSize="large" />}
        sx={{
          borderRadius: 2,
          "& .MuiAlert-message": { width: "100%" },
        }}
      >
        <AlertTitle sx={{ fontWeight: "bold" }}>
          {t("profile.completion.title")}
        </AlertTitle>

        <Box sx={{ mt: 2 }}>
          {/* Progress Stepper */}
          <Stepper activeStep={completedSteps} alternativeLabel sx={{ mb: 3 }}>
            <Step>
              <StepLabel
                StepIconProps={{
                  completed: !isMissingPersonalInfo,
                }}
              >
                <Typography variant="body2">
                  {t("profile.completion.personalInfo")}
                </Typography>
                <Chip
                  size="small"
                  label={
                    !isMissingPersonalInfo
                      ? t("profile.completion.completed")
                      : t("profile.completion.pending")
                  }
                  color={!isMissingPersonalInfo ? "success" : "default"}
                  sx={{ mt: 1 }}
                />
              </StepLabel>
            </Step>
            <Step>
              <StepLabel
                StepIconProps={{
                  completed: !hasMissingDocuments,
                }}
              >
                <Typography variant="body2">
                  {t("profile.completion.documents")}
                </Typography>
                <Chip
                  size="small"
                  label={
                    !hasMissingDocuments
                      ? t("profile.completion.completed")
                      : t("profile.completion.pending")
                  }
                  color={!hasMissingDocuments ? "success" : "default"}
                  sx={{ mt: 1 }}
                />
              </StepLabel>
            </Step>
          </Stepper>
        </Box>
      </Alert>
    </Box>
  );
}
