"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  List,
  CircularProgress,
  Pagination,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

import { useStore } from "@/app/store/useStore";
import { useGroups } from "@/app/hooks/useGroups";
import { useGroupDocumentStatus } from "@/app/hooks/useGroupDocumentStatus";
import { SearchHeader } from "@/app/components/tableComponents/SearchHeader";
import { StateMessages } from "@/app/components/tableComponents/StateMessages";
import { UsersTable } from "@/app/components/tableComponents/UserTable";
import { createGroup } from "@/app/utils/apis/groups";
import { Company } from "@/app/utils/types/types";
import FormDialog from "@/app/components/dialogs/FormDialog";
import GroupListItem from "@/app/components/groups/GroupListItem";
import CompanyAutocomplete from "@/app/components/company/CompanyAutocomplete";

export default function GroupsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useStore();

  // Add ref to track if initial load is done
  const initialLoadRef = useRef(false);

  // Groups state
  const {
    groups,
    loading,
    error,
    page,
    pageSize,
    total,
    handlePageChange,
    loadGroups,
  } = useGroups();

  // Document status state
  const {
    users: usersWithDocumentStatus,
    summary: documentSummary,
    loading: documentStatusLoading,
    error: documentStatusError,
    loadUsersWithDocumentStatus,
  } = useGroupDocumentStatus();

  // Local state
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    company: null as Company | null, // Changed from companyId to company object
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isAdmin = currentUser?.role === "Admin";

  useEffect(() => {
    if (isAuthenticated && isAdmin && !initialLoadRef.current) {
      console.log("Loading groups for the first time...");
      initialLoadRef.current = true;
      loadGroups();
    }
  }, [isAuthenticated, isAdmin, loadGroups]);

  // Search handling - DEBOUNCED to prevent multiple calls
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);

      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Debounce search
      searchTimeoutRef.current = setTimeout(() => {
        loadGroups(1, pageSize, term);
      }, 300);
    },
    [pageSize, loadGroups]
  );

  const handleRefresh = useCallback(() => {
    initialLoadRef.current = false;
    loadGroups(page, pageSize, searchTerm);
    if (selectedGroup) {
      loadUsersWithDocumentStatus(selectedGroup);
    }
  }, [
    page,
    pageSize,
    searchTerm,
    loadGroups,
    selectedGroup,
    loadUsersWithDocumentStatus,
  ]);

  // Group selection with document status loading
  const handleGroupClick = useCallback(
    async (groupId: number) => {
      const newSelectedGroup = groupId === selectedGroup ? null : groupId;
      setSelectedGroup(newSelectedGroup);

      if (newSelectedGroup) {
        await loadUsersWithDocumentStatus(newSelectedGroup);
      }
    },
    [selectedGroup, loadUsersWithDocumentStatus]
  );

  // Create group handlers
  const handleCreateClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewGroup({ name: "", company: null });
    setCreateError(null);
  };

  const handleCreateGroup = async () => {
    try {
      setCreateLoading(true);
      setCreateError(null);

      if (!newGroup.company) {
        setCreateError("Please select a company");
        return;
      }

      const response = await createGroup({
        name: newGroup.name,
        companyId: newGroup.company.id,
      });

      if (response.success) {
        setSuccessMessage("Group created successfully");
        handleCloseDialog();
        // Refresh groups list
        initialLoadRef.current = false;
        loadGroups();
      } else {
        setCreateError(response.error || "Failed to create group");
      }
    } catch (error) {
      console.error("Failed to create group:", error);
      setCreateError(
        error instanceof Error ? error.message : "Failed to create group"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  // Cleanup search timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Close success message
  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };

  // Show loading if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <SearchHeader
          title={t("groups.title")}
          searchTerm={searchTerm}
          loading={loading}
          onSearchChange={handleSearch}
          onSearch={() => handleSearch(searchTerm)}
          onRefresh={handleRefresh}
          onClear={() => handleSearch("")}
          placeholder={t("groups.search.placeholder")}
        />

        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            sx={{ minWidth: "fit-content" }}
          >
            {t("groups.addGroup")}
          </Button>
        )}

        {/* Groups List */}
        <Box sx={{ mt: 3 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <StateMessages
              error={error}
              isEmpty={groups.length === 0}
              hasSearch={!!searchTerm}
              onRefresh={handleRefresh}
              labels={{
                tryAgain: t("common.tryAgain"),
                noResults: t("common.noResults"),
                noUsers: t("common.noUsers"),
                showAll: t("common.showAll"),
              }}
            />
          ) : (
            <List sx={{ width: "100%" }}>
              {groups.map((group) => (
                <GroupListItem
                  key={group.id}
                  id={group.id}
                  name={group.name}
                  createdAt={group.createdAt}
                  companyName={group.companyName}
                  isSelected={selectedGroup === group.id}
                  onClick={handleGroupClick}
                />
              ))}
            </List>
          )}
        </Box>

        {/* Show Users Table when a group is selected */}
        {selectedGroup && !loading && (
          <Box sx={{ mt: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6">{t("groups.groupMembers")}</Typography>
              {isAdmin && (
                <Button
                  variant="outlined"
                  startIcon={<PersonAddIcon />}
                  onClick={() =>
                    router.push(`/groups/add-users?groupId=${selectedGroup}`)
                  }
                >
                  {t("groups.addMembers")}
                </Button>
              )}
            </Box>

            {/* Document Status Error Alert */}
            {documentStatusError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {documentStatusError}
              </Alert>
            )}

            {/* Document Status Summary */}
            {documentSummary && (
              <Box sx={{ mb: 2 }}>
                <Alert severity="info">
                  Document Completion: {documentSummary.completeDocuments}/
                  {documentSummary.totalUsers} users (
                  {documentSummary.completionPercentage}%)
                </Alert>
              </Box>
            )}

            <UsersTable
              users={usersWithDocumentStatus}
              total={usersWithDocumentStatus.length}
              page={0}
              rowsPerPage={usersWithDocumentStatus.length || 10}
              loading={documentStatusLoading}
              showCompany={true}
              showDocumentStatus={true}
              documentStatusLoading={documentStatusLoading}
              onViewUser={(id) => router.push(`/officePortal/users/${id}`)}
              onPageChange={() => {}}
              onRowsPerPageChange={() => {}}
              labels={{
                columns: {
                  name: t("common.name"),
                  idNumber: t("common.idNumber"),
                  course: t("common.course"),
                  company: t("common.company"),
                  registrationDate: t("common.registrationDate"),
                  actions: t("common.actions"),
                  documentStatus: t("common.documentStatus"),
                },
                pagination: {
                  rowsPerPage: t("common.rowsPerPage"),
                },
              }}
            />
          </Box>
        )}

        {/* Add Group Dialog - UPDATED */}
        <FormDialog
          open={openDialog}
          title={t("groups.createNew")}
          onClose={handleCloseDialog}
          onSubmit={handleCreateGroup}
          isLoading={createLoading}
          isValid={!!newGroup.name && !!newGroup.company}
          submitLabel={t("groups.create")}
        >
          <TextField
            autoFocus
            label={t("groups.groupName")}
            fullWidth
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            error={!!createError && !newGroup.name}
            helperText={
              !newGroup.name && createError ? "Group name is required" : ""
            }
            sx={{ mb: 2 }}
          />

          <CompanyAutocomplete
            value={newGroup.company}
            onChange={(company) => setNewGroup({ ...newGroup, company })}
            label={t("groups.company")}
            placeholder="Search by company name or ID..."
            required
            error={!!createError && !newGroup.company}
            helperText={
              !newGroup.company && createError ? "Please select a company" : ""
            }
          />

          {createError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {createError}
            </Alert>
          )}
        </FormDialog>

        {/* Pagination for Groups */}
        {groups.length > 0 && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={Math.ceil(total / pageSize)}
              page={page}
              onChange={(_, newPage) => handlePageChange(newPage)}
              disabled={loading}
            />
          </Box>
        )}

        {/* Success Message Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={handleCloseSuccessMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" onClose={handleCloseSuccessMessage}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}
