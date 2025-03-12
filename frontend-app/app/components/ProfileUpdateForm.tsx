import React, { useState } from "react";
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
  Grid2,
} from "@mui/material";

import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PersonOutline as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { ProfileUpdateData, updateUserProfile } from "@/app/utils/apis/users";
import { UserDetails } from "../utils/types/types";

interface ProfileUpdateFormProps {
  user: UserDetails;
  onUpdateSuccess: () => void;
}

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({
  user,
  onUpdateSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    middleName: user.middleName || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "",
    currentResidencyAddress: user.currentResidencyAddress || "",
    birthPlaceAddress: user.birthPlaceAddress || "",
    EGN: user.EGN || "",
    IBAN: user.IBAN || "",
  });

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
        IBAN: user.IBAN || "",
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
        setError("No changes were made");
        setIsSubmitting(false);
        return;
      }

      const response = await updateUserProfile(changedFields);

      if (response.success) {
        setSuccess("Profile updated successfully");
        setIsEditing(false);
        onUpdateSuccess();
      } else {
        setError(response.error || "Failed to update profile");
      }
    } catch (err) {
      setError("An unexpected error occurred");
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

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          {filledFields > 0 ? (
            <>
              {filledFields} additional field{filledFields !== 1 && "s"}{" "}
              completed
            </>
          ) : (
            <>No additional information provided</>
          )}
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={handleExpandToggle}
          endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {isExpanded ? "Hide Details" : "View Details"}
        </Button>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <PersonIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Personal Information</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant={isEditing ? "outlined" : "contained"}
          color={isEditing ? "error" : "primary"}
          startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
          onClick={handleEditToggle}
          disabled={isSubmitting}
          size="small"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
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
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                required
                margin="normal"
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Middle Name"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                required
                margin="normal"
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="EGN"
                name="EGN"
                value={formData.EGN}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Current Address"
                name="currentResidencyAddress"
                value={formData.currentResidencyAddress}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Birth Place"
                name="birthPlaceAddress"
                value={formData.birthPlaceAddress}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="IBAN"
                name="IBAN"
                value={formData.IBAN}
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid2>
          </Grid2>

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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          )}

          {!isEditing && isExpanded && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Button
                onClick={handleExpandToggle}
                variant="text"
                endIcon={<ExpandLessIcon />}
              >
                Hide Details
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ProfileUpdateForm;
