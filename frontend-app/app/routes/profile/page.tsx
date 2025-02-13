"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../store/zustandStore";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Box,
} from "@mui/material";

export default function ProfilePage() {
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      fetchUser(); // Fetch user data on page load
    }
  }, [user, fetchUser]);

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 4, p: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
              {user.firstName.charAt(0)}
            </Avatar>
          </Box>
          <Typography variant="h5" align="center">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            @{user.companyId}
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            {user.email}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
