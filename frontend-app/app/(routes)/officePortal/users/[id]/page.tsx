"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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

// Refactor this
export default function OfficePortalUserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user: currentUser } = useStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Check if user is admin
  const isAdmin = currentUser?.role === "Admin";

  // Helper function to parse the user ID from params
  const getUserId = useCallback((): number => {
    if (!params.id || typeof params.id !== "string") {
      return 0;
    }

    const parsedId = parseInt(params.id, 10);
    return isNaN(parsedId) ? 0 : parsedId;
  }, [params.id]);

  console.log("AdminEditProfile", isAuthenticated);

  useEffect(() => {
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
  }, [isAuthenticated, isAdmin, getUserId, router]);

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
            Назад
          </Button>
          <Typography variant="h5" component="h1">
            Управление на потребител
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          {/* Admin actions like suspend user, reset password, etc. */}
          <AdminUserActions
            userId={user.details.id}
            userEmail={user.details.email}
            onActionComplete={handleProfileUpdate}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* User basic info summary */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" component="div">
              <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                Име:
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

          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <EmailIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
              <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                Email:
              </Box>
              {user.details.email}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <PhoneIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
              <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                Телефон:
              </Box>
              {user.details.phoneNumber || "Не е посочен"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <WorkIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
              <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                Фирма:
              </Box>
              {user.company ? user.company.companyName : "Не е посочена"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <CalendarIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
              <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                Регистриран на:
              </Box>
              {formatDate(user.details.createdAt)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                Статус:
              </Box>
              <Chip label="Активен" color="success" size="small" />
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
