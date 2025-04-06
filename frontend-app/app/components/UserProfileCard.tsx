"use client";
import { Card, CardContent, Typography, Box, Chip, Avatar, Divider } from "@mui/material";
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon } from "@mui/icons-material";
import { User } from "@/app/utils/types/types"; 
import { useTranslation } from "react-i18next"; // Import translation hook

interface UserProfileCardProps {
  user: User;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  const { t } = useTranslation(); // Add translation hook
  
  if (!user || !user.details) return null;
  
  // Get user role(s)
  const role = Array.isArray(user.role) 
    ? user.role.join(', ') 
    : user.role;
    
  // Format phone number if available
  const phone = user.details.phoneNumber || "-";
  
  // Count document, course, and certificate counts
  const documentCount = user.documents?.length || 0;
  const courseCount = user.enrolledCourses?.length || 0;
  const certCount = user.certificates?.length || 0;
  
  return (
    <Card elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
      {/* Card Header - Blue Background */}
      <Box sx={{ bgcolor: "primary.main", py: 3, px: 3, color: "white" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: "primary.light",
              border: "3px solid white"
            }}
          >
            {user.details.firstName.charAt(0)}{user.details.lastName.charAt(0)}
          </Avatar>
          
          <Box sx={{ ml: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              {user.details.firstName} {user.details.middleName || ''} {user.details.lastName}
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <Chip 
                label={role} 
                size="small"
                sx={{ 
                  bgcolor: "rgba(255,255,255,0.2)", 
                  color: "white",
                  fontWeight: "medium",
                  "& .MuiChip-label": { px: 2 } 
                }} 
              />
              <Typography variant="caption" sx={{ ml: 1 }}>
                {t("profile.userCard.role")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Contact Information */}
      <CardContent sx={{ py: 3 }}>
        <Box>
          {/* Email */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <EmailIcon sx={{ color: "primary.main", mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                {t("profile.userCard.email")}
              </Typography>
              <Typography variant="body1">
                {user.details.email}
              </Typography>
            </Box>
          </Box>
          
          {/* Phone */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PhoneIcon sx={{ color: "primary.main", mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                {t("profile.userCard.phone")}
              </Typography>
              <Typography variant="body1">
                {phone}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Stats Row */}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
          <Box>
            <Typography variant="h6" color="primary">
              {courseCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("profile.userCard.courses")}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" color="primary">
              {documentCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("profile.userCard.documents")}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" color="primary">
              {certCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("profile.userCard.certificates")}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}