"use client";

import React, { useEffect } from "react";
import { Container, Paper, Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/store/useStore";
import { useLoadUsers } from "@/app/hooks/useLoadUsers";
import { SearchHeader } from "@/app/components/tableComponents/SearchHeader";
import { StateMessages } from "@/app/components/tableComponents/StateMessages";
import { UsersTable } from "@/app/components/tableComponents/UserTable";
import { useTranslation } from "react-i18next";

export default function OfficePortalPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useStore();
  const isAdmin = user?.role === "Admin";
  const { t } = useTranslation();

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
          title={t("officePortal.title")}
          searchTerm={searchTerm}
          loading={loading}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          onClear={() => setSearchTerm("")}
          placeholder={t("search.byName")}
          labels={{
            search: t("common.search"),
            refresh: t("common.refresh"),
          }}
        />

        <StateMessages
          error={error}
          isEmpty={!loading && users.length === 0}
          hasSearch={!!searchTerm}
          onRefresh={handleRefresh}
          labels={{
            tryAgain: t("common.tryAgain"),
            noResults: t("common.noResults"),
            noUsers: t("common.noUsersRegistered"),
            showAll: t("common.showAll"),
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
                name: t("common.name"),
                idNumber: t("common.idNumber"),
                course: t("common.course"),
                registrationDate: t("common.registrationDate"),
                actions: t("common.actions"),
                company: t("common.company"),
              },
              pagination: {
                rowsPerPage: t("common.rowsPerPage"),
              },
            }}
          />
        )}
      </Paper>
    </Container>
  );
}
