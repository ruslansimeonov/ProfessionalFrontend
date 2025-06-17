"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { Company } from "@/app/utils/types/types";

interface PendingCompaniesTableProps {
  companies: Company[];
  actionLoading: { [key: number]: boolean };
  onApprove: (
    companyId: number
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  onReject: (
    companyId: number,
    reason?: string
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  onView?: (company: Company) => void;
}

export default function PendingCompaniesTable({
  companies,
  actionLoading,
  onApprove,
  onReject,
  onView,
}: PendingCompaniesTableProps) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async (company: Company) => {
    const result = await onApprove(company.id);
    if (result.success) {
      // Could show success toast here
      console.log("Company approved:", result.message);
    } else {
      // Could show error toast here
      console.error("Failed to approve company:", result.error);
    }
  };

  const handleRejectClick = (company: Company) => {
    setSelectedCompany(company);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedCompany) return;

    const result = await onReject(selectedCompany.id, rejectionReason);
    if (result.success) {
      setRejectDialogOpen(false);
      setSelectedCompany(null);
      setRejectionReason("");
      console.log("Company rejected:", result.message);
    } else {
      console.error("Failed to reject company:", result.error);
    }
  };

  const handleRejectCancel = () => {
    setRejectDialogOpen(false);
    setSelectedCompany(null);
    setRejectionReason("");
  };

  if (companies.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <BusinessIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No pending companies
        </Typography>
        <Typography variant="body2" color="text.secondary">
          All companies have been reviewed
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Tax Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>MOL</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {company.companyName}
                  </Typography>
                </TableCell>
                <TableCell>{company.taxNumber}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>{company.MOL}</TableCell>
                <TableCell>{company.phoneNumber}</TableCell>
                <TableCell>
                  <Chip
                    label={company.status}
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {new Date(company.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                  >
                    {onView && (
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => onView(company)}
                          color="info"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Approve Company">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleApprove(company)}
                          disabled={actionLoading[company.id]}
                          color="success"
                        >
                          {actionLoading[company.id] ? (
                            <CircularProgress size={16} />
                          ) : (
                            <ApproveIcon />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Reject Company">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleRejectClick(company)}
                          disabled={actionLoading[company.id]}
                          color="error"
                        >
                          <RejectIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleRejectCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Company Registration</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to reject the registration for{" "}
            <strong>{selectedCompany?.companyName}</strong>?
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
          <Button onClick={handleRejectCancel}>Cancel</Button>
          <Button
            onClick={handleRejectConfirm}
            color="error"
            variant="contained"
            disabled={!selectedCompany || actionLoading[selectedCompany?.id]}
          >
            {selectedCompany && actionLoading[selectedCompany.id] ? (
              <CircularProgress size={20} />
            ) : (
              "Reject Company"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
