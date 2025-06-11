"use client";

import React, { useEffect } from "react";
import { Container, Paper, Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/store/useStore";
import { useLoadUsers } from "@/app/hooks/useLoadUsers";
import { SearchHeader } from "@/app/components/tableComponents/SearchHeader";
import { StateMessages } from "@/app/components/tableComponents/StateMessages";
import { UsersTable } from "@/app/components/tableComponents/UserTable";



export default function CompanyPortalPage() {
  const router = useRouter();
  const { isAuthenticated, user: currentUser } = useStore();
  const isCompany = currentUser?.role === "Company";

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
      router.push("/companyPortal");
      return;
    }

    if (!isCompany && currentUser?.role !== "Admin") {
      router.push("/");
      return;
    }
  }, [isAuthenticated, isCompany, router, currentUser?.role]);

  // Load data when authenticated and have companyId
  useEffect(() => {
    if (isAuthenticated && currentUser?.details?.companyId) {
      loadUsers(page, rowsPerPage, searchTerm);
    }
  }, [
    isAuthenticated,
    currentUser?.details?.companyId,
    page,
    rowsPerPage,
    searchTerm,
    loadUsers,
  ]);

  const handleViewUser = (userId: string | number) => {
    router.push(`/companyPortal/users/${userId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
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
      </Paper>
    </Container>
  );
}
