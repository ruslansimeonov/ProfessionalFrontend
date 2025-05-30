"use client";

import React, { useEffect } from "react";
import { Container, Paper, Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/store/useStore";
import { useLoadUsers } from "@/app/hooks/useLoadUsers";
import { SearchHeader } from "@/app/components/tableComponents/SearchHeader";
import { StateMessages } from "@/app/components/tableComponents/StateMessages";
import { UsersTable } from "@/app/components/tableComponents/UserTable";

export default function OfficePortalPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useStore();
  const isAdmin = user?.role === "Admin";

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
  } = useLoadUsers();

  // // Redirect if not authenticated
  // useEffect(() => {
  //   console.log("inside useEffect 1", isAuthenticated, isAdmin);
  //   if (!isAuthenticated || !isAdmin) {
  //     router.push("/");
  //     return;
  //   }
  // }, [isAuthenticated, isAdmin, router]);

  useEffect(() => {
    console.log("inside useEffect 2", isAuthenticated, isAdmin);

    if (!isAuthenticated || !isAdmin) {
      router.push("/");
      return;
    }
    if (isAuthenticated && isAdmin) {
      loadUsers(page, rowsPerPage, searchTerm);
    }
  }, [
    isAuthenticated,
    isAdmin,
    page,
    rowsPerPage,
    searchTerm,
    loadUsers,
    router,
  ]);

  // Navigate to user's details page
  const handleViewUser = (userId: string | number) => {
    router.push(`/officePortal/users/${userId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <SearchHeader
          title="Office Portal Users"
          searchTerm={searchTerm}
          loading={loading}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          onClear={() => setSearchTerm("")}
          placeholder="Search by name or ID"
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
            showCompany={true}
            loading={loading}
            onViewUser={handleViewUser}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labels={{
              columns: {
                name: "Name",
                idNumber: "ID Number",
                course: "Course",
                registrationDate: "Registration Date",
                actions: "Actions",
                company: "Company",
              },
              pagination: {
                rowsPerPage: "Rows per page:",
              },
              showCompanyColumn: false,
            }}
          />
        )}
      </Paper>
    </Container>
  );
}
