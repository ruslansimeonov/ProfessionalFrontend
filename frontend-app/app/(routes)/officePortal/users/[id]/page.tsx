"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useStore } from "@/app/store/useStore";
import { useDocumentRequirements } from "@/app/hooks/useDocumentRequirements";
import AdminUserProfileEditor from "@/app/components/admin/AdminUserProfileEditor";
import { formatDate } from "@/app/utils/documentUtils";
import AdminUserActions from "@/app/components/admin/AdminUserActions";
import { User } from "@/app/utils/types/types";
import { getUser } from "@/app/utils/apis/users";
import { useTranslation } from "react-i18next";

interface PageProps {
  params: Promise<{ id: string }>; // Updated for Next.js 15
}

export default function OfficePortalUserProfilePage({ params }: PageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, user: currentUser } = useStore();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Check if user is admin
  const isAdmin = currentUser?.role === "Admin";

  // Resolve the async params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.id);
    };

    resolveParams();
  }, [params]);

  // Helper function to parse the user ID
  const getUserId = useCallback((): number => {
    if (!userId || typeof userId !== "string") {
      return 0;
    }

    const parsedId = parseInt(userId, 10);
    return isNaN(parsedId) ? 0 : parsedId;
  }, [userId]);

  console.log("AdminEditProfile", isAuthenticated);

  useEffect(() => {
    // Don't run if userId is not resolved yet
    if (!userId) return;

    console.log("AdminEditProfile", isAuthenticated);

    if (!isAuthenticated) {
      router.push("/login?redirect=/officePortal");
      return;
    }

    if (!isAdmin) {
      router.push("/");
      return;
    }

    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const response = await getUser(getUserId());
        if ("data" in response) {
          setUser(response.data);
        } else {
          setError(response.error || "Failed to load user profile");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load user profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [isAuthenticated, isAdmin, getUserId, router, userId]); // Added userId dependency

  // Handle profile update success
  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const response = await getUser(getUserId());
      if ("data" in response) {
        setUser(response.data);

        setUpdateMessage({
          type: "success",
          text: "Профилът беше успешно актуализиран",
        });
      } else {
        setUpdateMessage({
          type: "error",
          text: response.error || "Грешка при зареждане на профила",
        });
      }

      // Auto-dismiss message after 5 seconds
      setTimeout(() => {
        setUpdateMessage(null);
      }, 5000);
    } catch (err) {
      setUpdateMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Грешка при актуализиране на профила",
      });
    } finally {
      setLoading(false);
    }
  };

  // Use the document requirements hook for this specific user
  const {
    loading: loadingDocRequirements,
    missingDocumentNames,
    hasAllRequiredDocuments,
  } = useDocumentRequirements(user?.details?.id, user?.documents || []);

  const handleBack = () => {
    router.push("/officePortal");
  };

  // Don't render anything until userId is resolved
  if (!userId) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <CircularProgress
        sx={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  }

  if (loading && !user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography color="error" gutterBottom>
            {error || "User not found"}
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="outlined"
          >
            Back to Users List
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with back button and actions */}
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="outlined"
          >
            {t("officePortal.back")}
          </Button>
          <Typography variant="h5" component="h1">
            {t("officePortal.userManagement")}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          <AdminUserActions
            userId={user.details.id}
            userEmail={user.details.email}
            onActionComplete={handleProfileUpdate}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* User basic info summary */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" component="div">
              <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                {t("officePortal.name")}:
              </Box>
              {[
                user.details.firstName,
                user.details.middleName,
                user.details.lastName,
              ]
                .filter(Boolean)
                .join(" ")}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <EmailIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
              <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                {t("officePortal.email")}:
              </Box>
              {user.details.email}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <PhoneIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
              <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                {t("officePortal.phone")}:
              </Box>
              {user.details.phoneNumber || t("officePortal.notSpecified")}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <WorkIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
              <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                {t("officePortal.company")}:
              </Box>
              {user.company
                ? user.company.companyName
                : t("officePortal.notSpecified")}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <CalendarIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
              <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                {t("officePortal.registeredOn")}:
              </Box>
              {formatDate(user.details.createdAt)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                {t("officePortal.status")}:
              </Box>
              <Chip
                label={t("officePortal.active")}
                color="success"
                size="small"
              />
            </Box>
          </Grid>
        </Grid>

        {updateMessage && (
          <Alert
            severity={updateMessage.type}
            sx={{ mt: 2 }}
            onClose={() => setUpdateMessage(null)}
          >
            {updateMessage.text}
          </Alert>
        )}
      </Paper>

      {/* Main user profile editor with all sections */}
      {user && (
        <AdminUserProfileEditor
          user={user}
          missingDocumentNames={missingDocumentNames}
          hasAllRequiredDocuments={hasAllRequiredDocuments}
          loadingDocRequirements={loadingDocRequirements}
          onUserUpdate={handleProfileUpdate}
        />
      )}
    </Container>
  );
}
