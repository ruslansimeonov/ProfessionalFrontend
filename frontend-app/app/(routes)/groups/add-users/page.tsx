"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/app/store/useStore";
import { SearchHeader } from "@/app/components/tableComponents/SearchHeader";
import { UsersTable } from "@/app/components/tableComponents/UserTable";
import {
  addUsersToGroup,
  fetchAvailableUsersForGroup,
} from "@/app/utils/apis/groups";
import { User } from "@/app/utils/types/types";
import { useTranslation } from "react-i18next";

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    </Container>
  );
}

// Component that uses useSearchParams
function AddUsersToGroupContent() {
  const { t } = useTranslation();

  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user: currentUser } = useStore();
  const groupId = searchParams.get("groupId");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isAdmin = currentUser?.role === "Admin";

  // Load users with search and pagination
  const loadUsers = useCallback(
    async (currentPage: number, searchTerm: string = "") => {
      try {
        setLoading(true);
        setError(null);

        // Use the new API that filters out existing group members
        // and applies company restrictions if applicable
        const response = await fetchAvailableUsersForGroup(
          Number(groupId),
          currentPage + 1,
          pageSize,
          searchTerm
        );

        setUsers(response.users);
        setTotal(response.total);
      } catch (error) {
        console.error("Failed to load available users:", error);
        setError(t("errors.failedToLoadAvailableUsers"));
      } finally {
        setLoading(false);
      }
    },
    [groupId, pageSize, t]
  );

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login");
      return;
    }

    if (!groupId) {
      router.push("/groups");
      return;
    }

    loadUsers(page, searchTerm);
  }, [isAuthenticated, isAdmin, router, groupId, page, searchTerm, loadUsers]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(0);
    loadUsers(0, term);
  };

  const handleRefresh = () => {
    loadUsers(page, searchTerm);
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    loadUsers(newPage, searchTerm);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setPage(0);
    loadUsers(0, searchTerm);
  };

  const handleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddUsers = async () => {
    if (!groupId || selectedUsers.length === 0) return;

    try {
      setSaving(true);
      setError(null);

      const response = await addUsersToGroup(Number(groupId), selectedUsers);

      if (response.success) {
        setSuccessMessage(t("groups.usersAddedSuccessfully"));
        setSelectedUsers([]);
        setTimeout(() => {
          router.push("/groups");
        }, 2000);
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Failed to add users to group:", error);
      setError(t("errors.failedToAddUsers"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/groups")}
          >
            {t("groups.backToGroups")}
          </Button>
          <Typography variant="h5">{t("groups.addUsersToGroup")}</Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <SearchHeader
          title={t("groups.selectUsers")}
          searchTerm={searchTerm}
          loading={loading}
          onSearchChange={handleSearch}
          onSearch={() => handleSearch(searchTerm)}
          onRefresh={handleRefresh}
          onClear={() => handleSearch("")}
          placeholder={t("groups.search.users")}
        />

        <UsersTable
          users={users}
          total={total}
          page={page}
          rowsPerPage={pageSize}
          loading={loading}
          showCompany={true}
          selectable
          selectedUsers={selectedUsers}
          onUserSelect={handleUserSelection}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
          labels={{
            columns: {
              name: t("common.name"),
              idNumber: t("common.idNumber"),
              course: t("common.course"),
              company: t("common.company"),
              registrationDate: t("common.registrationDate"),
              actions: t("common.actions"),
            },
            pagination: {
              rowsPerPage: t("common.rowsPerPage"),
            },
          }}
        />

        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            variant="contained"
            onClick={handleAddUsers}
            disabled={saving || selectedUsers.length === 0}
          >
            {saving ? (
              <CircularProgress size={24} />
            ) : (
              `${t("groups.addSelectedUsers")} (${selectedUsers.length})`
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

// Main component with Suspense wrapper
export default function AddUsersToGroupPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AddUsersToGroupContent />
    </Suspense>
  );
}
