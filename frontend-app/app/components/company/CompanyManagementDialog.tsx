"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { getCompanyById } from "@/app/utils/apis/companies";
import { getCompanyInvitations } from "@/app/utils/apis/invitationCodes"; // Fixed import path
import CreateInvitationDialog from "./CompanyInvitationDialog"; // Fixed import
import InvitationsTable from "../invitation/InvitationsTable"; // Fixed import
import { Company, Invitation } from "@/app/utils/types/types";

interface CompanyManagementDialogProps {
  open: boolean;
  onClose: () => void;
  companyId: number | null;
}

export default function CompanyManagementDialog({
  open,
  onClose,
  companyId,
}: CompanyManagementDialogProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createInvitationOpen, setCreateInvitationOpen] = useState(false);

  // Load company details
  const loadCompanyData = useCallback(async () => {
    if (!companyId) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Loading company data for ID:", companyId);
      const response = await getCompanyById(companyId);
      console.log("Company data response:", response);

      if (response.success) {
        setCompany(response.data);
      } else {
        setError(response.error || "Failed to load company");
      }
    } catch (err) {
      console.error("Error loading company:", err);
      setError("Failed to load company details");
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  // Load invitations
  const loadInvitations = useCallback(async () => {
    if (!companyId) return;

    setInvitationsLoading(true);

    try {
      console.log("Loading invitations for company ID:", companyId);
      const response = await getCompanyInvitations(companyId);
      console.log("Invitations response:", response);

      if (response.success) {
        setInvitations(response.data || []);
      } else {
        console.error("Failed to load invitations:", response.error);
        setInvitations([]);
      }
    } catch (err) {
      console.error("Error loading invitations:", err);
      setInvitations([]);
    } finally {
      setInvitationsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (open && companyId) {
      loadCompanyData();
      loadInvitations();
    }
  }, [open, companyId, loadCompanyData, loadInvitations]);

  const handleCreateInvitationSuccess = () => {
    loadInvitations(); // Refresh invitations list
    setCreateInvitationOpen(false);
  };

  const handleDeactivateInvitation = async (invitationId: number) => {
    try {
      // TODO: Implement deactivation API call
      console.log("Deactivating invitation:", invitationId);
      loadInvitations(); // Refresh the list
    } catch (error) {
      console.error("Failed to deactivate invitation:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("bg-BG");
  };

  if (!open) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: "80vh" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon color="primary" />
            <Typography variant="h6">Company Management</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {company && !loading && (
            <Box>
              {/* Company Information */}
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Company Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Company Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {company.companyName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tax Number
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {company.taxNumber}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{company.email}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1">
                      {company.phoneNumber || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Manager (MOL)
                    </Typography>
                    <Typography variant="body1">{company.MOL}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={company.status}
                      color={getStatusColor(company.status)}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">{company.address}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(company.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(company.updatedAt)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Invitation Codes Section */}
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Invitation Codes</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Refresh invitations">
                      <IconButton onClick={loadInvitations} size="small">
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setCreateInvitationOpen(true)}
                    >
                      Create Invitation
                    </Button>
                  </Box>
                </Box>

                {invitationsLoading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 2 }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <InvitationsTable
                    invitations={invitations}
                    onDeactivate={handleDeactivateInvitation}
                    onRefresh={loadInvitations}
                  />
                )}
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Invitation Dialog */}
      <CreateInvitationDialog
        open={createInvitationOpen}
        onClose={() => setCreateInvitationOpen(false)}
        onSuccess={handleCreateInvitationSuccess}
        companyId={companyId}
        companyName={company?.companyName}
      />
    </>
  );
}
