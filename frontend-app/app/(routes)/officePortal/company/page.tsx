"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  CircularProgress,
  Button,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Business as BusinessIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/store/useStore";
import { useLoadCompanies } from "@/app/hooks/useLoadCompanies";
import { SearchHeader } from "@/app/components/tableComponents/SearchHeader";
import { StateMessages } from "@/app/components/tableComponents/StateMessages";
import CompaniesTable from "@/app/components/company/CompanyTable";
import CreateCompanyDialog from "@/app/components/company/CreateCompanyDialog";
import CompanyManagementDialog from "@/app/components/company/CompanyManagementDialog";

export default function OfficePortalCompanyPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useStore();
  const isAdmin = user?.role === "Admin";

  const [createCompanyDialogOpen, setCreateCompanyDialogOpen] = useState(false);
  const [managementDialogOpen, setManagementDialogOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );

  const {
    companies,
    total,
    page,
    rowsPerPage,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    loadCompanies,
    handleSearch,
    handleRefresh,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useLoadCompanies();

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, isAdmin, router]);

  // Load companies when authenticated
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadCompanies(page, rowsPerPage, searchTerm);
    }
  }, [isAuthenticated, isAdmin, page, rowsPerPage, searchTerm, loadCompanies]);

  const handleViewCompany = (companyId: number) => {
    setSelectedCompanyId(companyId);
    setManagementDialogOpen(true);
  };

  const handleCreateCompanySuccess = () => {
    handleRefresh();
  };

  const handleManagementDialogClose = () => {
    setManagementDialogOpen(false);
    setSelectedCompanyId(null);
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <CircularProgress
        sx={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  }

  console.log("Companies loaded:", companies);

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <BusinessIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" component="h1" fontWeight="bold">
              Company Management
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateCompanyDialogOpen(true)}
            sx={{ minWidth: "fit-content" }}
          >
            Add Company
          </Button>
        </Box>

        <SearchHeader
          title=""
          searchTerm={searchTerm}
          loading={loading}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          onClear={() => setSearchTerm("")}
          placeholder="Search companies by name or tax number..."
          labels={{
            search: "Search",
            refresh: "Refresh",
          }}
        />

        <StateMessages
          error={error}
          isEmpty={!loading && companies.length === 0}
          hasSearch={!!searchTerm}
          onRefresh={handleRefresh}
          labels={{
            tryAgain: "Try Again",
            noResults: "No companies found",
            noUsers: "No companies registered",
            showAll: "Show all companies",
          }}
        />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && companies.length > 0 && (
          <CompaniesTable
            companies={companies}
            total={total}
            page={page}
            rowsPerPage={rowsPerPage}
            loading={loading}
            onViewCompany={handleViewCompany}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}

        {/* Create Company Dialog */}
        <CreateCompanyDialog
          open={createCompanyDialogOpen}
          onClose={() => setCreateCompanyDialogOpen(false)}
          onSuccess={handleCreateCompanySuccess}
        />

        {/* Company Management Dialog */}
        <CompanyManagementDialog
          open={managementDialogOpen}
          onClose={handleManagementDialogClose}
          companyId={selectedCompanyId}
        />
      </Paper>
    </Container>
  );
}
