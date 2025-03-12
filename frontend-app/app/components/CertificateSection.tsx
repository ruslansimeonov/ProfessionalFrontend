import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  Button,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Verified as VerifiedIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { Certificate } from "../utils/types/types";

interface CertificatesSectionProps {
  certificates: Certificate[];
}

const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  certificates,
}) => {
  // Format date to be more readable
  const formatDate = (dateString: Date | string | undefined): string => {
    if (!dateString) return "Unknown date";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid date";
    }
  };

  // Calculate whether a certificate is expired
  const isExpired = (expirationDate: Date | string | undefined): boolean => {
    if (!expirationDate) return false;
    try {
      return new Date(expirationDate) < new Date();
    } catch (e: unknown) {
      console.error("Error checking certificate expiration:", e);
      return false;
    }
  };

  // Get the status of the certificate
  const getCertificateStatus = (cert: Certificate) => {
    if (!cert.isActive) {
      return <Chip label="Inactive" color="default" size="small" />;
    }

    if (isExpired(cert.expirationDate)) {
      return <Chip label="Expired" color="error" size="small" />;
    }

    return <Chip label="Valid" color="success" size="small" />;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography
        variant="h6"
        gutterBottom
        component="div" // Important: Use div instead of p
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        <VerifiedIcon sx={{ mr: 1 }} />
        Your Certificates
      </Typography>

      {certificates?.length > 0 ? (
        <List sx={{ p: 0 }}>
          {certificates.map((cert) => {
            // Safety check for malformed certificate objects
            if (!cert) {
              return null;
            }

            return (
              <ListItem
                key={cert.id || `cert-${Math.random()}`}
                sx={{
                  borderLeft: "4px solid",
                  borderColor: isExpired(cert.expirationDate)
                    ? "error.main"
                    : "success.main",
                  pl: 2,
                  mb: 1.5,
                  backgroundColor: "background.paper",
                  borderRadius: "0 4px 4px 0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  <Box sx={{ minWidth: 40, mt: 0.5 }}>
                    <VerifiedIcon
                      color={
                        isExpired(cert.expirationDate) ? "error" : "success"
                      }
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" component="div">
                        Certificate {cert.id || ""}
                      </Typography>
                      {getCertificateStatus(cert)}
                    </Box>

                    <Box sx={{ mt: 0.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <CalendarIcon
                          fontSize="small"
                          sx={{ mr: 0.5, color: "text.secondary" }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="div"
                        >
                          Issued: {formatDate(cert.issuedAt)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CalendarIcon
                          fontSize="small"
                          sx={{ mr: 0.5, color: "text.secondary" }}
                        />
                        <Typography
                          variant="body2"
                          color={
                            isExpired(cert.expirationDate)
                              ? "error"
                              : "text.secondary"
                          }
                          component="div"
                        >
                          Expires: {formatDate(cert.expirationDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {cert.certificateUrl && (
                  <Tooltip title="View Certificate">
                    <Button
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      sx={{ mt: { xs: 1, sm: 0 } }}
                    >
                      View
                    </Button>
                  </Tooltip>
                )}
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body2" color="text.secondary" component="div">
            No certificates available yet.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default CertificatesSection;
