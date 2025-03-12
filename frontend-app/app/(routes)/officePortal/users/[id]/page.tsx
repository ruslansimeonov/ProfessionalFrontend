"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { useStore } from "@/app/store/useStore";

interface User {
  id: string | number;
  firstName: string;
  middleName?: string;
  lastName: string;
  EGN?: string;
  email: string;
  phoneNumber?: string;
  enrolledCourses?: Array<{
    id: number;
    name: string;
  }>;
  company?: {
    id: number;
    name: string;
  };
  createdAt: string;
}

const fetchUserProfile = async (userId: string): Promise<User> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const apiUrl = `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    }/api/users/${userId}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user: currentUser } = useStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  const isAdmin = currentUser?.role === "Admin";

  useEffect(() => {
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
        const userData = await fetchUserProfile(params.id as string);
        setUser(userData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load user profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [isAuthenticated, isAdmin, params.id, router]);

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

  if (loading) {
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
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header with back button */}
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="outlined"
          >
            Назад
          </Button>
          <Typography variant="h5" component="h1">
            Потребителски профил
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* User Information */}
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <PersonIcon sx={{ mr: 1 }} />
                Основна информация
              </Typography>
              <Box sx={{ ml: 4 }}>
                <Typography gutterBottom>
                  <strong>Име:</strong>{" "}
                  {[user.firstName, user.middleName, user.lastName]
                    .filter(Boolean)
                    .join(" ")}
                </Typography>
                {user.EGN && (
                  <Typography gutterBottom>
                    <strong>ЕГН:</strong> {user.EGN}
                  </Typography>
                )}
                <Typography gutterBottom>
                  <strong>Email:</strong>{" "}
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <EmailIcon fontSize="small" />
                    {user.email}
                  </Box>
                </Typography>
                {user.phoneNumber && (
                  <Typography gutterBottom>
                    <strong>Телефон:</strong>{" "}
                    <Box
                      component="span"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <PhoneIcon fontSize="small" />
                      {user.phoneNumber}
                    </Box>
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Enrollment Information */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <SchoolIcon sx={{ mr: 1 }} />
                Записани курсове
              </Typography>
              <Box sx={{ ml: 4 }}>
                {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {user.enrolledCourses.map((course) => (
                      <Chip
                        key={course.id}
                        label={course.name}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    Няма записани курсове
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Company Information */}
          <Grid item xs={12}>
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <BusinessIcon sx={{ mr: 1 }} />
                Компания
              </Typography>
              <Box sx={{ ml: 4 }}>
                {user.company ? (
                  <Typography>
                    <strong>Име на компанията:</strong> {user.company.name}
                  </Typography>
                ) : (
                  <Typography color="text.secondary">
                    Няма асоциирана компания
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
