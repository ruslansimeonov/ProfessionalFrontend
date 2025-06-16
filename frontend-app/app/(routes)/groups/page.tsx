"use client";

import React, { useState, useCallback, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

import { useStore } from "@/app/store/useStore";
import { useGroups } from "@/app/hooks/useGroups";
import { useGroupDocumentStatus } from "@/app/hooks/useGroupDocumentStatus"; // ADD THIS IMPORT
import { SearchHeader } from "@/app/components/tableComponents/SearchHeader";
import { StateMessages } from "@/app/components/tableComponents/StateMessages";
import { UsersTable } from "@/app/components/tableComponents/UserTable";
import { createGroup } from "@/app/utils/apis/groups";
import { Company } from "@/app/utils/types/types";
import { getCompanies } from "@/app/utils/apis/companies";
import FormDialog from "@/app/components/dialogs/FormDialog";
import GroupListItem from "@/app/components/groups/GroupListItem";

export default function GroupsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user: currentUser } = useStore();

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

  // Document status state - ADD THIS
  const {
    users: usersWithDocumentStatus,
    summary: documentSummary,
    loading: documentStatusLoading,
    error: documentStatusError,
    loadUsersWithDocumentStatus,
    loadDocumentStatusSummary,
  } = useGroupDocumentStatus();

  // Local state
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    companyId: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isAdmin = currentUser?.role === "Admin";

  // Load initial data
  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // Load companies when dialog opens
  useEffect(() => {
    if (openDialog) {
      const fetchCompanies = async () => {
        try {
          setCompaniesLoading(true);
          setCompaniesError(null);

          const response = await getCompanies();
          console.log("Raw API response:", response);

          if (response && response.success) {
            if (response.data && Array.isArray(response.data.companies)) {
              setCompanies(response.data.companies);
            } else {
              console.error(
                "Response.data.companies is not an array:",
                response.data
              );
              setCompaniesError("Invalid data format received");
              setCompanies([]);
            }
          } else {
            console.error("API call failed:", response);
            setCompaniesError(response?.error || "Failed to load companies");
            setCompanies([]);
          }
        } catch (error) {
          console.error("Exception in fetch companies:", error);
          setCompaniesError("Network error loading companies");
          setCompanies([]);
        } finally {
          setCompaniesLoading(false);
        }
      };
      fetchCompanies();
    }
  }, [openDialog]);

  // Search handling
  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      loadGroups(1, pageSize, term);
    },
    [pageSize, loadGroups]
  );

  const handleRefresh = useCallback(() => {
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

  // UPDATED: Group selection with document status loading
  const handleGroupClick = useCallback(
    async (groupId: number) => {
      const newSelectedGroup = groupId === selectedGroup ? null : groupId;
      setSelectedGroup(newSelectedGroup);

      if (newSelectedGroup) {
        // Load users with document status instead of regular users
        await loadUsersWithDocumentStatus(newSelectedGroup);
        // Optionally load summary too
        await loadDocumentStatusSummary(newSelectedGroup);
      }
    },
    [selectedGroup, loadUsersWithDocumentStatus, loadDocumentStatusSummary]
  );

  // Create group handlers
  const handleCreateClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewGroup({ name: "", companyId: "" });
    setCreateError(null);
  };

  const handleCreateGroup = async () => {
    try {
      setCreateLoading(true);
      setCreateError(null);

      const response = await createGroup(newGroup);
      if (response.success) {
        setSuccessMessage("Group created successfully");
        handleCloseDialog();
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

  // // Pagination wrapper functions
  // const handlePageChangeWrapper = (
  //   event: React.MouseEvent<HTMLButtonElement> | null,
  //   newPage: number
  // ) => {
  //   handlePageChange(newPage);
  // };

  // const handlePageSizeChangeWrapper = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const newPageSize = parseInt(event.target.value, 10);
  //   handlePageSizeChange(newPageSize);
  // };

  // Close success message
  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };

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

        {/* Show Users Table when a group is selected - UPDATED */}
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
              users={usersWithDocumentStatus} // USE USERS WITH DOCUMENT STATUS
              total={usersWithDocumentStatus.length}
              page={0} // Reset to 0 since we're showing all group users
              rowsPerPage={usersWithDocumentStatus.length || 10}
              loading={documentStatusLoading} // USE DOCUMENT STATUS LOADING
              showCompany={true}
              showDocumentStatus={true}
              documentStatusLoading={documentStatusLoading}
              onViewUser={(id) => router.push(`/officePortal/users/${id}`)}
              onPageChange={() => {}} // No pagination for group users
              onRowsPerPageChange={() => {}} // No pagination for group users
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

        {/* Add Group Dialog */}
        <FormDialog
          open={openDialog}
          title={t("groups.createNew")}
          onClose={handleCloseDialog}
          onSubmit={handleCreateGroup}
          isLoading={createLoading}
          isValid={!!newGroup.name && !!newGroup.companyId}
          submitLabel={t("groups.create")}
        >
          <TextField
            autoFocus
            label={t("groups.groupName")}
            fullWidth
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            error={!!createError}
            helperText={createError}
          />

          <FormControl fullWidth>
            <InputLabel>{t("groups.company")}</InputLabel>
            <Select
              value={newGroup.companyId}
              onChange={(e) =>
                setNewGroup({ ...newGroup, companyId: e.target.value })
              }
              label={t("groups.company")}
              disabled={companiesLoading}
            >
              {companiesLoading ? (
                <MenuItem disabled>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} />
                    {t("groups.loadingCompanies")}
                  </Box>
                </MenuItem>
              ) : companiesError ? (
                <MenuItem disabled>
                  {t("groups.errorLoadingCompanies")}
                </MenuItem>
              ) : companies &&
                Array.isArray(companies) &&
                companies.length > 0 ? (
                companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.companyName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>{t("groups.noCompaniesAvailable")}</MenuItem>
              )}
            </Select>
          </FormControl>
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
