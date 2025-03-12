import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
  Divider,
  Grid2,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";

interface UserProfileCardProps {
  user: {
    details: {
      id: number;
      firstName: string;
      middleName?: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
      username?: string;
      roles?: string[];
      isAdmin?: boolean;
    };
    company?: {
      companyName: string;
      id: number;
    } | null;
  };
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const { details, company } = user;
  const fullName = `${details.firstName} ${details.middleName || ""} ${
    details.lastName
  }`.trim();

  return (
    <Card sx={{ mt: 4, p: 3, boxShadow: 3, mb: 4 }}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "primary.main",
              mb: 2,
              fontSize: "2rem",
            }}
          >
            {details.firstName?.charAt(0)}
            {details.lastName?.charAt(0)}
          </Avatar>

          <Typography variant="h5" gutterBottom>
            {fullName}
          </Typography>

          {details.username && (
            <Typography
              variant="subtitle1"
              color="textSecondary"
              sx={{ mb: 1 }}
            >
              @{details.username}
            </Typography>
          )}

          {details.roles && details.roles.length > 0 && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mb: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {details.roles.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  color={
                    role === "Admin"
                      ? "error"
                      : role === "Instructor"
                      ? "primary"
                      : "default"
                  }
                  size="small"
                  icon={<BadgeIcon />}
                />
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: details.phoneNumber ? 6 : 12 }}>
            <Box display="flex" alignItems="center">
              <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
              <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                {details.email}
              </Typography>
            </Box>
          </Grid2>

          {details.phoneNumber && (
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box display="flex" alignItems="center">
                <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body2">{details.phoneNumber}</Typography>
              </Box>
            </Grid2>
          )}

          {company && (
            <Grid2 size={{ xs: 12 }}>
              <Box display="flex" alignItems="center" mt={1}>
                <BusinessIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body2">{company.companyName}</Typography>
              </Box>
            </Grid2>
          )}
        </Grid2>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
