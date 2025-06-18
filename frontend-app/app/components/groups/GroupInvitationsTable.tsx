"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { GroupInvitation } from "@/app/utils/types/types";

interface GroupInvitationsTableProps {
  invitations: GroupInvitation[];
  onDeactivate: (invitationId: number) => Promise<void>;
  onRefresh: () => void;
}

export default function GroupInvitationsTable({
  invitations,
  onDeactivate,
}: GroupInvitationsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bg-BG");
  };

  const getStatusChip = (invitation: GroupInvitation) => {
    if (!invitation.isActive) {
      return <Chip label="Inactive" color="error" size="small" />;
    }
    if (invitation.isExpired) {
      return <Chip label="Expired" color="warning" size="small" />;
    }
    if (invitation.currentUses >= invitation.maxUses) {
      return <Chip label="Used Up" color="warning" size="small" />;
    }
    return <Chip label="Active" color="success" size="small" />;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard:", text);
      // You might want to show a success message here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getRegistrationUrl = (code: string) => {
    return `${window.location.origin}/register?groupCode=${code}`;
  };

  if (!invitations || invitations.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <GroupIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No group invitation codes found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create an invitation code to allow users to join this group
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Code</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Usage</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Expires</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created By</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}
                    >
                      {invitation.invitationCode}
                    </Typography>
                    <Tooltip title="Copy code">
                      <IconButton
                        size="small"
                        onClick={() =>
                          copyToClipboard(invitation.invitationCode)
                        }
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 150 }}>
                    {invitation.description || "No description"}
                  </Typography>
                </TableCell>
                <TableCell>{getStatusChip(invitation)}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {invitation.currentUses || invitation.usageCount || 0} /{" "}
                    {invitation.maxUses}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(invitation.expiresAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {invitation.createdByName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(invitation.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Copy registration URL">
                      <IconButton
                        size="small"
                        onClick={() =>
                          copyToClipboard(
                            getRegistrationUrl(invitation.invitationCode)
                          )
                        }
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {invitation.isActive && !invitation.isExpired && (
                      <Tooltip title="Deactivate">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={async () => {
                            try {
                              await onDeactivate(invitation.id);
                            } catch (error) {
                              console.error(
                                "Failed to deactivate invitation:",
                                error
                              );
                            }
                          }}
                          disabled={
                            !invitation.isActive || invitation.isExpired
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
