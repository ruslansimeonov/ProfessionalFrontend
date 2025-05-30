"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { getUsers } from "@/app/utils/apis/users";
import { addUsersToGroup } from "@/app/utils/apis/groups";
import { User } from "@/app/utils/types/types";

export default function AddUsersToGroupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user: currentUser } = useStore();
  const groupId = searchParams.get('groupId');

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isAdmin = currentUser?.role === "Admin";

  // Load users with search and pagination
  const loadUsers = useCallback(async (currentPage: number, searchTerm: string = "") => {
    try {
      setLoading(true);
      const response = await getUsers({
        page: currentPage,
        pageSize,
        search: searchTerm
      });

      if (response.success) {
        setUsers(response.data.users);
        setTotal(response.data.total);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

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
    setPage(1);
    loadUsers(1, term);
  };

  const handleRefresh = () => {
    loadUsers(page, searchTerm);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadUsers(newPage, searchTerm);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
    loadUsers(1, searchTerm);
  };

  const handleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
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
        setSuccessMessage("Users added successfully");
        setSelectedUsers([]);
        setTimeout(() => {
          router.push("/groups");
        }, 2000);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("Failed to add users to group");
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
            Back to Groups
          </Button>
          <Typography variant="h5">Add Users to Group</Typography>
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
          title="Select Users"
          searchTerm={searchTerm}
          loading={loading}
          onSearchChange={handleSearch}
          onSearch={() => handleSearch(searchTerm)}
          onRefresh={handleRefresh}
          onClear={() => handleSearch("")}
          placeholder="Search users..."
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
              name: "Name",
              idNumber: "EGN",
              company: "Company",
              registrationDate: "Registration Date",
              actions: "Actions",
            },
            pagination: {
              rowsPerPage: "Rows per page:",
            },
            showCompanyColumn: true,
          }}
        />

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleAddUsers}
            disabled={saving || selectedUsers.length === 0}
          >
            {saving ? <CircularProgress size={24} /> : `Add Selected Users (${selectedUsers.length})`}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}