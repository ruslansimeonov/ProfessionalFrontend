import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Collapse,
  Grid,
  AlertTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PersonOutline as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { ProfileUpdateData, updateUserProfile } from "@/app/utils/apis/users";
import { UserDetails } from "../utils/types/types";
import { updateUserProfileAsAdmin } from "@/app/utils/apis/admin";

interface ProfileUpdateFormProps {
  user: UserDetails;
  onUpdateSuccess: () => void;
  isMissingRequiredInfo?: boolean;
  isAdmin?: boolean;
  userId?: number;
}

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({
  user,
  onUpdateSuccess,
  isMissingRequiredInfo = false,
  isAdmin = false,
  userId,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(isMissingRequiredInfo);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    middleName: user.middleName || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "",
    currentResidencyAddress: user.currentResidencyAddress || "",
    birthPlaceAddress: user.birthPlaceAddress || "",
    EGN: user.EGN || "",
    iban: user.iban || "",
  });

  // Update expansion state if the required info status changes
  useEffect(() => {
    if (isMissingRequiredInfo) {
      setIsExpanded(true);
    }
  }, [isMissingRequiredInfo]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form if canceling edit
      setFormData({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        currentResidencyAddress: user.currentResidencyAddress || "",
        birthPlaceAddress: user.birthPlaceAddress || "",
        EGN: user.EGN || "",
        iban: user.iban || "",
      });
      setError(null);
    } else {
      // Expand card when editing
      setIsExpanded(true);
    }
    setIsEditing(!isEditing);
    setSuccess(null);
  };

  const handleExpandToggle = () => {
    // Don't allow collapse while editing
    if (!isEditing) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (isMissingRequiredInfo) {
      if (
        !formData.EGN ||
        !formData.birthPlaceAddress ||
        !formData.currentResidencyAddress
      ) {
        setError(t("errorMessages.fillInRequired"));
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Only include fields that have changed
      const changedFields: ProfileUpdateData = {};
      Object.entries(formData).forEach(([key, value]) => {
        // Compare with user directly, not user.details
        if (user[key as keyof UserDetails] !== value && value !== "") {
          changedFields[key as keyof ProfileUpdateData] = value;
        }
      });

      if (Object.keys(changedFields).length === 0) {
        setError(t("errorMessages.changesNotMade"));
        setIsSubmitting(false);
        return;
      }

      let response;

      // Use different API method based on whether admin is editing or not
      if (isAdmin && userId) {
        response = await updateUserProfileAsAdmin(userId, changedFields);
      } else {
        response = await updateUserProfile(changedFields);
      }

      if (response.success) {
        setSuccess(t("successMessages.profileUpdated"));
        setIsEditing(false);
        onUpdateSuccess();
      } else {
        setError(response.error || t("errorMessages.unableToUpdateProfile"));
      }
    } catch (err) {
      setError(t("errorMessages.unexpectedError"));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSummary = () => {
    const filledFields = Object.entries(user).filter(
      ([key, value]) =>
        value &&
        key !== "id" &&
        key !== "firstName" &&
        key !== "lastName" &&
        key !== "email"
    ).length;

    const missingRequiredCount =
      (!user.EGN ? 1 : 0) +
      (!user.birthPlaceAddress ? 1 : 0) +
      (!user.currentResidencyAddress ? 1 : 0);

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          {isMissingRequiredInfo ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "warning.main",
              }}
            >
              <WarningIcon fontSize="small" sx={{ mr: 1 }} />
              <span>
                {t("personalInfo.missingFields", {
                  count: missingRequiredCount,
                })}
              </span>
            </Box>
          ) : (
            <>
              {filledFields > 0 ? (
                <>
                  {t("personalInfo.fieldsCompleted", { count: filledFields })}
                </>
              ) : (
                <>{t("personalInfo.noAdditionalInfo")}</>
              )}
            </>
          )}
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={handleExpandToggle}
          endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {isExpanded
            ? t("personalInfo.hideDetails")
            : t("personalInfo.showDetails")}
        </Button>
      </Box>
    );
  };

  const isFieldRequired = (fieldName: string) => {
    return ["EGN", "birthPlaceAddress", "currentResidencyAddress"].includes(
      fieldName
    );
  };

  const isMissingField = (fieldName: string) => {
    return (
      isFieldRequired(fieldName) &&
      !formData[fieldName as keyof typeof formData]
    );
  };

  return (
    <Paper
      id="personal-info" // Add this ID for scrolling from profile completion
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        border: isMissingRequiredInfo ? "1px solid" : "none",
        borderColor: "warning.main",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <PersonIcon sx={{ mr: 1 }} />
        <Typography variant="h6">{t("personalInfo.title")}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant={isEditing ? "outlined" : "contained"}
          color={isEditing ? "error" : "primary"}
          startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
          onClick={handleEditToggle}
          disabled={isSubmitting}
          size="small"
        >
          {isEditing ? t("personalInfo.cancel") : t("personalInfo.edit")}
        </Button>
      </Box>

      {!isExpanded && !isEditing && (
        <>
          <Divider sx={{ my: 2 }} />
          {renderSummary()}
        </>
      )}

      <Collapse in={isExpanded || isEditing}>
        <Divider sx={{ mb: 3, mt: 1 }} />

        {isMissingRequiredInfo && !isEditing && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>
              {t("personalInfo.requiredFieldsAlert.title")}
            </AlertTitle>
            {t("personalInfo.requiredFieldsAlert.message")}
            <Button
              variant="contained"
              color="warning"
              size="small"
              sx={{ mt: 1 }}
              onClick={handleEditToggle}
            >
              {t("personalInfo.requiredFieldsAlert.action")}
            </Button>
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label={t("personalInfo.formFields.firstName")}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                required
                margin="normal"
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label={t("personalInfo.formFields.middleName")}
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label={t("personalInfo.formFields.lastName")}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                required
                margin="normal"
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t("personalInfo.formFields.phoneNumber")}
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={`${t("personalInfo.formFields.egn")} *`}
                name="EGN"
                value={formData.EGN}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                required
                variant={isEditing ? "outlined" : "filled"}
                error={isEditing && isMissingField("EGN")}
                helperText={
                  isEditing && isMissingField("EGN")
                    ? t("personalInfo.formFields.required")
                    : ""
                }
                sx={
                  isFieldRequired("EGN") && !isEditing
                    ? {
                        "& .MuiInputBase-input": {
                          bgcolor: !formData.EGN ? "warning.50" : "inherit",
                        },
                      }
                    : {}
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={`${t("personalInfo.formFields.residencyAddress")} *`}
                name="currentResidencyAddress"
                value={formData.currentResidencyAddress}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                required
                error={isEditing && isMissingField("currentResidencyAddress")}
                helperText={
                  isEditing && isMissingField("currentResidencyAddress")
                    ? t("personalInfo.formFields.required")
                    : ""
                }
                variant={isEditing ? "outlined" : "filled"}
                sx={
                  isFieldRequired("currentResidencyAddress") && !isEditing
                    ? {
                        "& .MuiInputBase-input": {
                          bgcolor: !formData.currentResidencyAddress
                            ? "warning.50"
                            : "inherit",
                        },
                      }
                    : {}
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={`${t("personalInfo.formFields.birthPlaceAddress")} *`}
                name="birthPlaceAddress"
                value={formData.birthPlaceAddress}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                required
                error={isEditing && isMissingField("birthPlaceAddress")}
                helperText={
                  isEditing && isMissingField("birthPlaceAddress")
                    ? t("personalInfo.formFields.required")
                    : ""
                }
                variant={isEditing ? "outlined" : "filled"}
                sx={
                  isFieldRequired("birthPlaceAddress") && !isEditing
                    ? {
                        "& .MuiInputBase-input": {
                          bgcolor: !formData.birthPlaceAddress
                            ? "warning.50"
                            : "inherit",
                        },
                      }
                    : {}
                }
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label={t("personalInfo.formFields.iban")}
                name="IBAN"
                value={formData.iban}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>
          </Grid>

          {isEditing && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={
                  isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />
                }
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("personalInfo.saving")
                  : t("personalInfo.save")}
              </Button>
            </Box>
          )}

          {!isEditing && isExpanded && !isMissingRequiredInfo && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Button
                onClick={handleExpandToggle}
                variant="text"
                endIcon={<ExpandLessIcon />}
              >
                {t("personalInfo.hideDetails")}
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ProfileUpdateForm;
