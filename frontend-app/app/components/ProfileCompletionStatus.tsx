import React from "react";
import {
  Paper,
  Typography,
  Alert,
  AlertTitle,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

interface ProfileCompletionStatusProps {
  isMissingPersonalInfo: boolean;
  hasMissingDocuments: boolean;
  missingDocTypes: string[];
  completedSteps: number;
}

export default function ProfileCompletionStatus({
  isMissingPersonalInfo,
  hasMissingDocuments,
  missingDocTypes,
  completedSteps,
}: ProfileCompletionStatusProps) {
  if (!isMissingPersonalInfo && !hasMissingDocuments) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: "primary.50" }}>
      <Alert
        severity={completedSteps === 0 ? "warning" : "info"}
        sx={{ mb: 2 }}
      >
        <AlertTitle>
          <strong>
            {completedSteps === 0
              ? "Моля, попълнете данните си за да завършите регистрацията"
              : "Профилът ви е почти завършен"}
          </strong>
        </AlertTitle>
        За да завършите процеса на регистрация, моля попълнете необходимата
        информация и качете изискуемите документи.
      </Alert>

      <Stepper activeStep={completedSteps} alternativeLabel sx={{ mt: 3 }}>
        <Step>
          <StepLabel error={isMissingPersonalInfo}>
            <Typography variant="body2" component="div">
              Лична информация
              {isMissingPersonalInfo && (
                <Typography
                  variant="caption"
                  component="div"
                  color="error.main"
                >
                  Изисква се: ЕГН, Местораждане, Постоянно местожителство
                </Typography>
              )}
            </Typography>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel error={hasMissingDocuments}>
            <Typography variant="body2" component="div">
              Качване на документи
              {hasMissingDocuments && (
                <Typography
                  variant="caption"
                  component="div"
                  color="error.main"
                >
                  Изисква се: {missingDocTypes.join(", ")}
                </Typography>
              )}
            </Typography>
          </StepLabel>
        </Step>
      </Stepper>
    </Paper>
  );
}
