"use client";

import React, { useEffect, useState } from "react";
import { Container, Paper, Box, CircularProgress, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/store/useStore";
import { useLoadUsers } from "@/app/hooks/useLoadUsers";
import { SearchHeader } from "@/app/components/tableComponents/SearchHeader";
import { StateMessages } from "@/app/components/tableComponents/StateMessages";
import { UsersTable } from "@/app/components/tableComponents/UserTable";
import CreateCompanyDialog from "@/app/components/company/CreateCompanyDialog";

export default function CompanyPortalPage() {
  const router = useRouter();
  const { isAuthenticated, user: currentUser } = useStore();
  const isCompany = currentUser?.role === "Company";
  const isAdmin = currentUser?.role === "Admin";

  // Add state for the dialog
  const [createCompanyDialogOpen, setCreateCompanyDialogOpen] = useState(false);

  const {
    users,
    total,
    page,
    rowsPerPage,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    loadUsers,
    handleSearch,
    handleRefresh,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useLoadUsers({
    isCompanyView: true,
    companyId: currentUser?.details?.companyId,
  });

  // Authentication and role check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isCompany && !isAdmin) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, isCompany, isAdmin, router]);

  // Load data when authenticated and have companyId
  useEffect(() => {
    if (isAuthenticated && (currentUser?.details?.companyId || isAdmin)) {
      loadUsers(page, rowsPerPage, searchTerm);
    }
  }, [
    isAuthenticated,
    currentUser?.details?.companyId,
    isAdmin,
    page,
    rowsPerPage,
    searchTerm,
    loadUsers,
  ]);

  const handleViewUser = (userId: string | number) => {
    router.push(`/companyPortal/users/${userId}`);
  };

  const handleCreateCompanySuccess = () => {
    // Refresh the page or show a success message
    handleRefresh();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <SearchHeader
            title="Company Users"
            searchTerm={searchTerm}
            loading={loading}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
            onRefresh={handleRefresh}
            onClear={() => setSearchTerm("")}
            placeholder="Search by name, ID, course..."
            labels={{
              search: "Search",
              refresh: "Refresh",
            }}
          />

          {/* Add Company Button - Only for Admins */}
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateCompanyDialogOpen(true)}
              sx={{ ml: 2, minWidth: "fit-content" }}
            >
              Add Company
            </Button>
          )}
        </Box>

        <StateMessages
          error={error}
          isEmpty={!loading && users.length === 0}
          hasSearch={!!searchTerm}
          onRefresh={handleRefresh}
          labels={{
            tryAgain: "Try Again",
            noResults: "No users found",
            noUsers: "No users registered",
            showAll: "Show all users",
          }}
        />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && users.length > 0 && (
          <UsersTable
            users={users}
            total={total}
            page={page}
            rowsPerPage={rowsPerPage}
            showCompany={false}
            loading={loading}
            onViewUser={handleViewUser}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labels={{
              columns: {
                name: "Name",
                idNumber: "EGN",
                course: "Course",
                registrationDate: "Registration Date",
                actions: "Actions",
              },
              pagination: {
                rowsPerPage: "Rows per page:",
              },
            }}
          />
        )}

        {/* Create Company Dialog */}
        <CreateCompanyDialog
          open={createCompanyDialogOpen}
          onClose={() => setCreateCompanyDialogOpen(false)}
          onSuccess={handleCreateCompanySuccess}
        />
      </Paper>
    </Container>
  );
}
