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
  LinearProgress,
  TextField,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Group as GroupIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import {
  Group,
  GroupInvitation,
  GroupCapacity,
  User,
  Company,
} from "@/app/utils/types/types";
import {
  getGroupById,
  getGroupCapacity,
  updateGroup,
  removeUserFromGroup,
  getGroupUsers,
} from "@/app/utils/apis/groups";
import {
  getGroupInvitations,
  deactivateGroupInvitation,
  updateGroupStatus,
} from "@/app/utils/apis/groupInvitationCodes";
import CompanyAutocomplete from "@/app/components/company/CompanyAutocomplete";
import GroupInvitationDialog from "./GroupInvitationDialog";
import GroupInvitationsTable from "./GroupInvitationsTable";
import AddUsersToGroupDialog from "./AddUsersToGroupDialog";

interface GroupManagementDialogProps {
  open: boolean;
  onClose: () => void;
  groupId: number | null;
  onGroupUpdated?: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`group-tabpanel-${index}`}
      aria-labelledby={`group-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function GroupManagementDialog({
  open,
  onClose,
  groupId,
  onGroupUpdated,
}: GroupManagementDialogProps) {
  const [group, setGroup] = useState<Group | null>(null);
  const [capacity, setCapacity] = useState<GroupCapacity | null>(null);
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [groupUsers, setGroupUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState(0);

  const statusOptions = [
    { value: "draft", label: "Draft", color: "default" },
    { value: "full", label: "Full", color: "warning" },
    { value: "closed", label: "Closed", color: "error" },
    { value: "completed", label: "Completed", color: "info" },
    { value: "cancelled", label: "Cancelled", color: "error" },
  ];

  // Edit states
  const [editMode, setEditMode] = useState(false);
  const [editedGroup, setEditedGroup] = useState({
    name: "",
    company: null as Company | null,
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // Dialog states
  const [createInvitationOpen, setCreateInvitationOpen] = useState(false);
  const [addUsersDialogOpen, setAddUsersDialogOpen] = useState(false);

  // Load group details and capacity
  const loadGroupData = useCallback(async () => {
    if (!groupId) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Loading group data for ID:", groupId);

      // Load group basic info
      const groupResponse = await getGroupById(groupId);
      if (groupResponse.success) {
        setGroup(groupResponse.data);
        setEditedGroup({
          name: groupResponse.data.name,
          company: groupResponse.data.companyId
            ? ({
                id: groupResponse.data.companyId,
                companyName: groupResponse.data.companyName || "",
              } as Company)
            : null,
        });
      } else {
        setError(groupResponse.error || "Failed to load group");
        return;
      }

      // Load capacity info
      const capacityResponse = await getGroupCapacity(groupId);
      if (capacityResponse.success) {
        setCapacity(capacityResponse.data.capacity);
      } else {
        console.warn("Failed to load capacity info:", capacityResponse.error);
      }
    } catch (err) {
      console.error("Error loading group:", err);
      setError("Failed to load group details");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // Load group users
  const loadGroupUsers = useCallback(async () => {
    if (!groupId) return;

    setUsersLoading(true);

    try {
      const response = await getGroupUsers(groupId);
      if (response.success) {
        setGroupUsers(response.data || []);
      } else {
        console.error("Failed to load group users:", response.error);
        setGroupUsers([]);
      }
    } catch (err) {
      console.error("Error loading group users:", err);
      setGroupUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, [groupId]);

  // Load invitations
  const loadInvitations = useCallback(async () => {
    if (!groupId) return;

    setInvitationsLoading(true);

    try {
      console.log("Loading invitations for group ID:", groupId);
      const response = await getGroupInvitations(groupId);

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
  }, [groupId]);

  useEffect(() => {
    if (open && groupId) {
      loadGroupData();
      loadInvitations();
      loadGroupUsers();
      setSuccessMessage(null);
      setError(null);
      setCurrentTab(0);
      setEditMode(false);
    }
  }, [open, groupId, loadGroupData, loadInvitations, loadGroupUsers]);

  // Update group information
  const handleUpdateGroup = async () => {
    if (!groupId || !editedGroup.name.trim()) {
      setError("Group name is required");
      return;
    }

    try {
      setUpdateLoading(true);
      setError(null);

      const updateData = {
        name: editedGroup.name.trim(),
        companyId: editedGroup.company?.id || null,
      };

      const response = await updateGroup(groupId, updateData);

      if (response.success) {
        setSuccessMessage("Group updated successfully!");
        setEditMode(false);
        await loadGroupData();
        onGroupUpdated?.();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || "Failed to update group");
      }
    } catch (error) {
      console.error("Error updating group:", error);
      setError("Failed to update group");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Remove user from group
  const handleRemoveUser = async (userId: number, userName: string) => {
    if (!groupId) return;

    if (
      !confirm(`Are you sure you want to remove ${userName} from this group?`)
    ) {
      return;
    }

    try {
      setError(null);

      const response = await removeUserFromGroup(groupId, userId);

      if (response.success) {
        setSuccessMessage(`${userName} removed from group successfully!`);
        await loadGroupUsers();
        await loadGroupData(); // Refresh capacity
        onGroupUpdated?.();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || "Failed to remove user from group");
      }
    } catch (error) {
      console.error("Error removing user from group:", error);
      setError("Failed to remove user from group");
    }
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Dialog handlers
  const handleCreateInvitationSuccess = () => {
    loadInvitations();
    setCreateInvitationOpen(false);
    setSuccessMessage("Group invitation created successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeactivateInvitation = async (invitationId: number) => {
    try {
      setError(null);

      const response = await deactivateGroupInvitation(invitationId);

      if (response.success) {
        await loadInvitations();
        setSuccessMessage("Invitation code deactivated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || "Failed to deactivate invitation");
      }
    } catch (error) {
      console.error("Error deactivating invitation:", error);
      setError("Failed to deactivate invitation");
    }
  };

  const handleAddUsersSuccess = () => {
    loadGroupUsers();
    loadGroupData(); // Refresh capacity
    setAddUsersDialogOpen(false);
    setSuccessMessage("Users added to group successfully!");
    onGroupUpdated?.();
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "full":
        return "warning";
      case "closed":
        return "error";
      case "completed":
        return "info";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getCapacityProgress = () => {
    if (!capacity) return 0;
    return (capacity.currentParticipants / capacity.maxParticipants) * 100;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("bg-BG");
  };

  const handleCloseDialog = () => {
    setSuccessMessage(null);
    setError(null);
    setEditMode(false);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              height: "90vh", // 🆕 Set fixed height instead of minHeight
              maxHeight: "90vh", // 🆕 Ensure it doesn't exceed viewport
              display: "flex", // 🆕 Use flexbox layout
              flexDirection: "column", // 🆕 Stack vertically
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <GroupIcon color="primary" />
            <Typography variant="h6">Group Management</Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 0,
            flex: 1, // 🆕 Take remaining space
            overflow: "hidden", // 🆕 Prevent content overflow
            display: "flex", // 🆕 Flex container
            flexDirection: "column", // 🆕 Stack vertically
          }}
        >
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ m: 3, mb: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ m: 3, mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {group && !loading && (
            <Box>
              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  aria-label="group management tabs"
                >
                  <Tab label="Group Information" />
                  <Tab label="Members" />
                  <Tab label="Invitation Codes" />
                </Tabs>
              </Box>

              {/* Tab 1: Group Information */}
              <TabPanel value={currentTab} index={0}>
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Group Information</Typography>
                    {!editMode ? (
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => setEditMode(true)}
                        variant="outlined"
                        size="small"
                      >
                        Edit Group
                      </Button>
                    ) : (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          startIcon={<SaveIcon />}
                          onClick={handleUpdateGroup}
                          variant="contained"
                          size="small"
                          disabled={updateLoading}
                        >
                          {updateLoading ? (
                            <CircularProgress size={16} />
                          ) : (
                            "Save"
                          )}
                        </Button>
                        <Button
                          startIcon={<CancelIcon />}
                          onClick={() => {
                            setEditMode(false);
                            setEditedGroup({
                              name: group.name,
                              company: group.companyId
                                ? ({
                                    id: group.companyId,
                                    companyName: group.companyName || "",
                                  } as Company)
                                : null,
                            });
                          }}
                          variant="outlined"
                          size="small"
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </Box>

                  <Grid container spacing={2}>
                    {/* Group Name */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Group Name
                      </Typography>
                      {editMode ? (
                        <TextField
                          fullWidth
                          value={editedGroup.name}
                          onChange={(e) =>
                            setEditedGroup({
                              ...editedGroup,
                              name: e.target.value,
                            })
                          }
                          size="small"
                          error={!editedGroup.name.trim()}
                          helperText={
                            !editedGroup.name.trim()
                              ? "Group name is required"
                              : ""
                          }
                        />
                      ) : (
                        <Typography variant="body1" fontWeight="medium">
                          {group.name}
                        </Typography>
                      )}
                    </Grid>

                    {/* Company */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Company
                      </Typography>
                      {editMode ? (
                        <CompanyAutocomplete
                          value={editedGroup.company}
                          onChange={(company) =>
                            setEditedGroup({ ...editedGroup, company })
                          }
                          placeholder="Select company (optional)"
                        />
                      ) : group.companyName ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <BusinessIcon fontSize="small" color="primary" />
                          <Typography variant="body1">
                            {group.companyName}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body1" color="text.secondary">
                          No company assigned
                        </Typography>
                      )}
                    </Grid>

                    {/* Status */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Status
                      </Typography>
                      <Chip
                        label={group.status}
                        color={getStatusColor(group.status)}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </Grid>

                    {/* Registration Status */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Registration Status
                      </Typography>
                      <Typography variant="body1">
                        {group.isRegistrationOpen ? "Open" : "Closed"}
                      </Typography>
                    </Grid>

                    {/* Created */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Created
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(group.createdAt.toString())}
                      </Typography>
                    </Grid>

                    {/* Last Updated */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(group.updatedAt.toString())}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Capacity Information */}
                  {capacity && (
                    <Box sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Group Capacity
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <PeopleIcon fontSize="small" />
                        <Typography variant="body1">
                          {capacity.currentParticipants} /{" "}
                          {capacity.maxParticipants} participants
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({capacity.availableSpots} spots available)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getCapacityProgress()}
                        sx={{ height: 8, borderRadius: 4 }}
                        color={
                          getCapacityProgress() >= 90
                            ? "error"
                            : getCapacityProgress() >= 70
                            ? "warning"
                            : "primary"
                        }
                      />
                    </Box>
                  )}
                </Paper>

                {/* Group Behavior Information */}
                <Alert
                  severity={group.companyName ? "info" : "warning"}
                  sx={{ mt: 2 }}
                >
                  <Typography variant="body2">
                    <strong>Registration Behavior:</strong>
                    {group.companyName ? (
                      <>
                        {" "}
                        Users registering with group invitation codes will be
                        added to this group AND automatically assigned to{" "}
                        <strong>{group.companyName}</strong>.
                      </>
                    ) : (
                      <>
                        {" "}
                        Users registering with group invitation codes will be
                        added to this group only. They will NOT be assigned to
                        any company.
                      </>
                    )}
                  </Typography>
                </Alert>
              </TabPanel>

              {/* Tab 2: Members */}
              <TabPanel value={currentTab} index={1}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    Group Members ({groupUsers.length})
                  </Typography>
                  <Button
                    startIcon={<PersonAddIcon />}
                    onClick={() => setAddUsersDialogOpen(true)}
                    variant="contained"
                    size="small"
                  >
                    Add Users
                  </Button>
                </Box>

                {usersLoading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 2 }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                ) : groupUsers.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: "center" }}>
                    <PeopleIcon
                      sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      No members in this group
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add users to get started
                    </Typography>
                  </Paper>
                ) : (
                  <Paper variant="outlined">
                    <List>
                      {groupUsers.map((user, index) => (
                        <React.Fragment key={user.details.id}>
                          <ListItem>
                            <ListItemText
                              primary={`${user.details.firstName} ${user.details.lastName}`}
                              secondary={
                                // 🆕 Fix: Use a single string instead of Box with nested elements
                                `${user.details.email}${
                                  user.company?.companyName
                                    ? ` • Company: ${user.company?.companyName}`
                                    : ""
                                }`
                              }
                            />
                            <ListItemSecondaryAction>
                              <Tooltip title="Remove from group">
                                <IconButton
                                  edge="end"
                                  color="error"
                                  onClick={() =>
                                    handleRemoveUser(
                                      user.details.id,
                                      `${user.details.firstName} ${user.details.lastName}`
                                    )
                                  }
                                  size="small"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index < groupUsers.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                )}
              </TabPanel>

              {/* Tab 3: Invitation Codes */}
              <TabPanel value={currentTab} index={2}>
                {group.status === "active" && capacity?.hasCapacity && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">
                        Group Invitation Codes
                      </Typography>
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
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          py: 2,
                        }}
                      >
                        <CircularProgress size={24} />
                      </Box>
                    ) : (
                      <GroupInvitationsTable
                        invitations={invitations}
                        onDeactivate={handleDeactivateInvitation}
                        onRefresh={loadInvitations}
                      />
                    )}
                  </>
                )}

                {/* Message for groups that can't have invitations */}
                {(group.status !== "active" || !capacity?.hasCapacity) && (
                  <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="body1" color="text.secondary">
                      {group.status !== "active"
                        ? "Invitation codes are only available for active groups."
                        : !capacity?.hasCapacity
                        ? "This group is full or registration is closed."
                        : "Invitation codes are not available for this group."}
                    </Typography>
                  </Paper>
                )}
              </TabPanel>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Invitation Dialog */}
      {group?.status === "active" && capacity?.hasCapacity && (
        <GroupInvitationDialog
          open={createInvitationOpen}
          onClose={() => setCreateInvitationOpen(false)}
          onSuccess={handleCreateInvitationSuccess}
          groupId={groupId}
          groupName={group?.name}
        />
      )}

      {/* Add Users Dialog */}
      <AddUsersToGroupDialog
        open={addUsersDialogOpen}
        onClose={() => setAddUsersDialogOpen(false)}
        onSuccess={handleAddUsersSuccess}
        groupId={groupId}
        groupName={group?.name}
      />
    </>
  );
}
