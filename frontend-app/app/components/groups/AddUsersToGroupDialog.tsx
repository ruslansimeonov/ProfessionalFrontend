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
  CircularProgress,
  Alert,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Paper,
  Pagination,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { User } from "@/app/utils/types/types";
import {
  fetchAvailableUsersForGroup,
  addUsersToGroup,
} from "@/app/utils/apis/groups";

interface AddUsersToGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  groupId: number | null;
  groupName?: string;
}

export default function AddUsersToGroupDialog({
  open,
  onClose,
  onSuccess,
  groupId,
  groupName,
}: AddUsersToGroupDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const loadUsers = useCallback(async () => {
    if (!groupId) return;

    setLoading(true);
    setError(null);

    try {
      const { users: fetchedUsers, total: totalUsers } =
        await fetchAvailableUsersForGroup(groupId, page, pageSize, searchTerm);

      setUsers(fetchedUsers);
      setTotal(totalUsers);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load available users");
    } finally {
      setLoading(false);
    }
  }, [groupId, page, searchTerm]);

  useEffect(() => {
    if (open && groupId) {
      loadUsers();
    }
  }, [open, groupId, loadUsers]);

  const handleUserToggle = (userId: number) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSubmit = async () => {
    if (!groupId || selectedUsers.size === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await addUsersToGroup(
        groupId,
        Array.from(selectedUsers)
      );

      if (response.success) {
        onSuccess();
        handleClose();
      } else {
        setError(response.error || "Failed to add users to group");
      }
    } catch (err) {
      console.error("Error adding users to group:", err);
      setError("Failed to add users to group");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setUsers([]);
    setSelectedUsers(new Set());
    setSearchTerm("");
    setPage(1);
    setError(null);
    onClose();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonAddIcon color="primary" />
          <Typography variant="h6">Add Users to Group</Typography>
        </Box>
        <Button
          onClick={handleClose}
          size="small"
          sx={{ minWidth: "auto", p: 0.5 }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent>
        {groupName && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Adding users to group: <strong>{groupName}</strong>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Users List */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              {searchTerm
                ? "No users found matching your search."
                : "No available users to add."}
            </Typography>
          </Paper>
        ) : (
          <>
            <Paper variant="outlined" sx={{ maxHeight: 400, overflow: "auto" }}>
              <List>
                {users.map((user) => (
                  <ListItem key={user.details.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleUserToggle(user.details.id)}
                      dense
                    >
                      <Checkbox
                        edge="start"
                        checked={selectedUsers.has(user.details.id)}
                        onChange={() => handleUserToggle(user.details.id)}
                      />
                      <ListItemText
                        primary={`${user.details.firstName} ${user.details.lastName}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {user.details.email}
                            </Typography>
                            {user.company?.companyName && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Company: {user.company?.companyName}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Pagination */}
            {Math.ceil(total / pageSize) > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={Math.ceil(total / pageSize)}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  disabled={loading}
                />
              </Box>
            )}

            {/* Selection Summary */}
            {selectedUsers.size > 0 && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {selectedUsers.size} user{selectedUsers.size === 1 ? "" : "s"}{" "}
                selected
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || selectedUsers.size === 0}
        >
          {submitting ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Adding Users...
            </>
          ) : (
            `Add ${selectedUsers.size} User${
              selectedUsers.size === 1 ? "" : "s"
            }`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
