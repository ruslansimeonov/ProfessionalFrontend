"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Box,
  List,
  Typography,
  CircularProgress,
  Pagination,
  Button,
} from "@mui/material";
import {
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/store/useStore";
import { SearchHeader } from "@/app/components/tableComponents/SearchHeader";
import { StateMessages } from "@/app/components/tableComponents/StateMessages";
import { UsersTable } from "@/app/components/tableComponents/UserTable";
import { useGroups } from "@/app/hooks/useGroups";
import { createGroup } from "@/app/utils/apis/groups";
import { Company } from "@/app/utils/types/types";
import { getCompanies } from "@/app/utils/apis/companies";
import FormDialog from "@/app/components/dialogs/FormDialog";
import GroupListItem from "@/app/components/groups/GroupListItem";

export default function GroupsPage() {
  const router = useRouter();
  const { user: currentUser } = useStore();
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]); // Replace with actual type

  const {
    groups,
    loading,
    error,
    page,
    pageSize,
    total,
    groupUsers,
    loadingUsers,
    handlePageChange,
    handlePageSizeChange,
    loadGroups,
    handleGroupSelect,
  } = useGroups();

  const isAdmin = currentUser?.role === "Admin";
  const [openDialog, setOpenDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    companyId: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handlePageChangeWrapper = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    handlePageChange(newPage);
  };

  const handlePageSizeChangeWrapper = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPageSize = parseInt(event.target.value, 10);
    handlePageSizeChange(newPageSize);
  };

  useEffect(() => {
    if (openDialog) {
      // Fetch companies when the dialog opens
      const fetchCompanies = async () => {
        try {
          const response = await getCompanies();
          if (response.success) {
            setCompanies(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch companies", error);
        }
      };
      fetchCompanies();
    }
  }, [openDialog]);

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      loadGroups(1, pageSize, term);
    },
    [pageSize, loadGroups]
  );

  const handleRefresh = useCallback(() => {
    loadGroups(page, pageSize, searchTerm);
  }, [page, pageSize, searchTerm, loadGroups]);

  const handleGroupClick = async (groupId: number) => {
    setSelectedGroup(groupId === selectedGroup ? null : groupId);
    if (groupId !== selectedGroup) {
      await handleGroupSelect(groupId);
    }
  };

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
        handleCloseDialog();
        handleRefresh(); // Refresh the groups list
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

  console.log("companies", companies);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <SearchHeader
          title="Course Groups"
          searchTerm={searchTerm}
          loading={loading}
          onSearchChange={handleSearch}
          onSearch={() => handleSearch(searchTerm)}
          onRefresh={handleRefresh}
          onClear={() => handleSearch("")}
          placeholder="Search groups by name..."
        />

        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            sx={{ minWidth: "fit-content" }}
          >
            Add Group
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
                tryAgain: "Try Again",
                noResults: "No groups found",
                noUsers: "No users in this group",
                showAll: "Show all groups",
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
            <Typography variant="h6" sx={{ mb: 2 }}>
              Group Members
            </Typography>
            {isAdmin && (
              <Button
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={() =>
                  router.push(`/groups/add-users?groupId=${selectedGroup}`)
                }
                sx={{ ml: 2 }}
              >
                Add Members
              </Button>
            )}
            <UsersTable
              users={groupUsers}
              total={groupUsers.length}
              page={page}
              rowsPerPage={pageSize}
              loading={loadingUsers}
              showCompany={true}
              onViewUser={(id) => router.push(`/officePortal/users/${id}`)}
              onPageChange={handlePageChangeWrapper} // Fixed handler
              onRowsPerPageChange={handlePageSizeChangeWrapper} // Fixed handler
              labels={{
                columns: {
                  name: "Name",
                  idNumber: "EGN",
                  course: "Course",
                  company: "Company",
                  registrationDate: "Registration Date",
                  actions: "Actions",
                },
                pagination: {
                  rowsPerPage: "Rows per page:",
                },
              }}
            />
          </Box>
        )}

        {/* Add Group Dialog */}
        <FormDialog
          open={openDialog}
          title="Create New Group"
          onClose={handleCloseDialog}
          onSubmit={handleCreateGroup}
          isLoading={createLoading}
          isValid={!!newGroup.name && !!newGroup.companyId}
          submitLabel="Create"
        >
          <TextField
            autoFocus
            label="Group Name"
            fullWidth
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            error={!!createError}
            helperText={createError}
          />
          <FormControl fullWidth>
            <InputLabel>Company</InputLabel>
            <Select
              value={newGroup.companyId}
              onChange={(e) =>
                setNewGroup({ ...newGroup, companyId: e.target.value })
              }
              label="Company"
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.companyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormDialog>

        {/* Pagination */}
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
      </Paper>
    </Container>
  );
}
