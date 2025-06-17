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
  TextField,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";
import {
  getCompanyById,
  approveCompany,
  rejectCompany,
} from "@/app/utils/apis/companies";
import {
  deactivateInvitationCode,
  getCompanyInvitations,
} from "@/app/utils/apis/invitationCodes";
import CreateInvitationDialog from "./CompanyInvitationDialog";
import InvitationsTable from "../invitation/InvitationsTable";
import { Company, Invitation } from "@/app/utils/types/types";

interface CompanyManagementDialogProps {
  open: boolean;
  onClose: () => void;
  companyId: number | null;
  onCompanyUpdated?: () => void; // Callback to refresh parent data
}

export default function CompanyManagementDialog({
  open,
  onClose,
  companyId,
  onCompanyUpdated,
}: CompanyManagementDialogProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createInvitationOpen, setCreateInvitationOpen] = useState(false);

  // Company approval/rejection states
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      setSuccessMessage(null);
      setError(null);
    }
  }, [open, companyId, loadCompanyData, loadInvitations]);

  // Handle company approval
  const handleApproveCompany = async () => {
    if (!companyId) return;

    try {
      setApprovalLoading(true);
      setError(null);

      const response = await approveCompany(companyId);

      if (response.success) {
        setSuccessMessage("Company approved successfully!");
        // Reload company data to reflect new status
        await loadCompanyData();
        // Notify parent to refresh data
        onCompanyUpdated?.();
      } else {
        setError(response.error || "Failed to approve company");
      }
    } catch (err) {
      console.error("Error approving company:", err);
      setError("Failed to approve company");
    } finally {
      setApprovalLoading(false);
    }
  };

  // Handle company rejection
  const handleRejectCompany = async () => {
    if (!companyId) return;

    try {
      setApprovalLoading(true);
      setError(null);

      const response = await rejectCompany(companyId, rejectionReason);

      if (response.success) {
        setSuccessMessage("Company rejected successfully!");
        setRejectDialogOpen(false);
        setRejectionReason("");
        // Reload company data to reflect new status
        await loadCompanyData();
        // Notify parent to refresh data
        onCompanyUpdated?.();
      } else {
        setError(response.error || "Failed to reject company");
      }
    } catch (err) {
      console.error("Error rejecting company:", err);
      setError("Failed to reject company");
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleCreateInvitationSuccess = () => {
    loadInvitations(); // Refresh invitations list
    setCreateInvitationOpen(false);
  };

  const handleDeactivateInvitation = async (invitationId: number) => {
    try {
      setError(null);

      console.log("Deactivating invitation:", invitationId);

      const response = await deactivateInvitationCode(invitationId);

      if (response.success) {
        console.log("Invitation deactivated successfully");
        // Refresh the invitations list to reflect the change
        await loadInvitations();

        // Optionally show success message
        setSuccessMessage("Invitation code deactivated successfully!");

        // Clear success message after a few seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        console.error("Failed to deactivate invitation:", response.error);
        setError(response.error || "Failed to deactivate invitation");
      }
    } catch (error) {
      console.error("Error deactivating invitation:", error);
      setError("Failed to deactivate invitation");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("bg-BG");
  };

  const handleCloseDialog = () => {
    setSuccessMessage(null);
    setError(null);
    setRejectionReason("");
    setRejectDialogOpen(false);
    onClose();
  };

  if (!open) return null;

  const isPending = company?.status === "pending";
  const isRejected = company?.status === "rejected";

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
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
          <IconButton onClick={handleCloseDialog} size="small">
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

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {company && !loading && (
            <Box>
              {/* Company Information */}
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Company Information</Typography>

                  {/* Approval Actions for Pending Companies */}
                  {isPending && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Approve Company">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<ApproveIcon />}
                          onClick={handleApproveCompany}
                          disabled={approvalLoading}
                        >
                          {approvalLoading ? (
                            <CircularProgress size={16} />
                          ) : (
                            "Approve"
                          )}
                        </Button>
                      </Tooltip>

                      <Tooltip title="Reject Company">
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<RejectIcon />}
                          onClick={() => setRejectDialogOpen(true)}
                          disabled={approvalLoading}
                        >
                          Reject
                        </Button>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                {/* Status Alert for Pending/Rejected Companies */}
                {isPending && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>This company is pending approval.</strong> Please
                      review the company details and approve or reject the
                      registration.
                    </Typography>
                  </Alert>
                )}

                {isRejected && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>This company has been rejected.</strong> The
                      company registration was declined.
                    </Typography>
                  </Alert>
                )}

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

              {/* Invitation Codes Section - Only show for active companies */}
              {company.status === "active" && (
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
              )}

              {/* Message for non-active companies */}
              {company.status !== "active" && (
                <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body1" color="text.secondary">
                    Invitation codes are only available for active companies.
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Confirmation Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Company Registration</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to reject the registration for{" "}
            <strong>{company?.companyName}</strong>?
          </Typography>
          <TextField
            label="Rejection Reason (Optional)"
            multiline
            rows={3}
            fullWidth
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Provide a reason for rejection..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRejectCompany}
            color="error"
            variant="contained"
            disabled={approvalLoading}
          >
            {approvalLoading ? (
              <CircularProgress size={20} />
            ) : (
              "Reject Company"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Invitation Dialog - Only for active companies */}
      {company?.status === "active" && (
        <CreateInvitationDialog
          open={createInvitationOpen}
          onClose={() => setCreateInvitationOpen(false)}
          onSuccess={handleCreateInvitationSuccess}
          companyId={companyId}
          companyName={company?.companyName}
        />
      )}
    </>
  );
}
