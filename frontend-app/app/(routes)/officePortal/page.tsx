"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  VisibilityOutlined as ViewIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/store/useStore";

// Types
interface User {
  id: string | number;
  firstName: string;
  middleName?: string;
  lastName: string;
  EGN?: string;
  enrolledCourseId?: number;
  enrolledCourseName?: string;
  companyName?: string;
  createdAt: string;
  email: string;
}

// API function to fetch users
const fetchRegisteredUsers = async (
  page: number,
  rowsPerPage: number,
  search?: string
): Promise<{ users: User[]; total: number }> => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Base URL for your API
    const apiUrl = `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    }/api/users`;

    // Fetch data from the API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Parse the response
    const data = await response.json();

    // Apply search filter in the frontend
    // In a real production app, you'd want to send the search term to the backend
    // and have the backend handle the filtering for better performance
    let filteredUsers = data;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = data.filter(
        (user: User) =>
          user.firstName?.toLowerCase().includes(searchLower) ||
          user.middleName?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          user.EGN?.toLowerCase().includes(searchLower) ||
          user.company?.name?.toLowerCase().includes(searchLower) ||
          user.enrolledCourses?.[0]?.name
            ?.toLowerCase()
            .includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower)
      );
    }

    // Get total count before pagination
    const total = filteredUsers.length;

    // Apply pagination in the frontend
    // Again, in production you'd want the backend to handle pagination
    const sortedUsers = [...filteredUsers].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const paginatedUsers = sortedUsers.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    // Transform the data to match our User interface if needed
    const transformedUsers: User[] = paginatedUsers.map((user: User) => ({
      id: user.id,
      firstName: user.firstName || "",
      middleName: user.middleName || "",
      lastName: user.lastName || "",
      EGN: user.EGN || "",
      enrolledCourseId: user.enrolledCourses?.[0]?.id,
      enrolledCourseName: user.enrolledCourses?.[0]?.name,
      companyName: user.company?.name || "",
      createdAt: user.createdAt || new Date().toISOString(),
      email: user.email || "",
    }));

    return { users: transformedUsers, total };
  } catch (error) {
    console.error("Error fetching registered users:", error);
    throw error;
  }
};

export default function OfficePortalPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get auth state from store
  const { isAuthenticated, user } = useStore();

  // Check if user is admin
  const isAdmin = user?.role === "Admin";

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/officePortal");
      return;
    }

    if (!isAdmin) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, isAdmin, router]);

  // Function to load users
  const loadUsers = async (
    pageNum: number = page,
    rowsNum: number = rowsPerPage,
    search: string = searchTerm
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { users: fetchedUsers, total: totalCount } =
        await fetchRegisteredUsers(pageNum, rowsNum, search);
      setUsers(fetchedUsers);
      setTotal(totalCount);
    } catch (err: unknown) {
      setError(
        `Грешка при зареждането на потребителите: ${
          err instanceof Error ? err.message : "Моля, опитайте отново."
        }`
      );
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load users on initial render and when pagination/search changes
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadUsers();
    }
  }, [page, rowsPerPage, isAuthenticated, isAdmin]);

  // Handle page change
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearch = () => {
    setPage(0);
    loadUsers(0, rowsPerPage, searchTerm);
  };

  // Handle search input keypress (search when Enter is pressed)
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setPage(0);
    setSearchTerm("");
    loadUsers(0, rowsPerPage, "");
  };

  // Navigate to user's details page
  const handleViewUser = (userId: string | number) => {
    router.push(`/officePortal/users/${userId}`);
  };

  // Get the full name of a user
  const getFullName = (user: User): string => {
    return [user.firstName, user.middleName, user.lastName]
      .filter(Boolean)
      .join(" ");
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("bg-BG", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error: unknown) {
      console.error("Error formatting date:", error);
      return "Невалидна дата";
    }
  };

  // If not authenticated or not an admin, show nothing while redirecting
  if (!isAuthenticated || !isAdmin) {
    return (
      <CircularProgress
        sx={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <PersonIcon sx={{ mr: 1 }} />
            Регистрирани потребители
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Търсене по име, ЕГН, курс..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchTerm("");
                        if (searchTerm) {
                          setPage(0);
                          loadUsers(0, rowsPerPage, "");
                        }
                      }}
                    >
                      ×
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
            >
              Търси
            </Button>
            <Tooltip title="Обнови">
              <IconButton
                color="primary"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Error message if any */}
        {error && (
          <Box sx={{ mb: 2 }}>
            <Typography color="error">{error}</Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{ mt: 1 }}
            >
              Опитайте отново
            </Button>
          </Box>
        )}

        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Users table */}
        {!loading && users.length > 0 && (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Име</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ЕГН</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Курс</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Фирма</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Дата на регистрация
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Действия
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        onClick={() => handleViewUser(user.id)}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PersonIcon
                            sx={{ mr: 1, color: "primary.main", fontSize: 20 }}
                          />
                          {getFullName(user)}
                        </Box>
                      </TableCell>
                      <TableCell onClick={() => handleViewUser(user.id)}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <BadgeIcon
                            sx={{
                              mr: 1,
                              color: "text.secondary",
                              fontSize: 20,
                            }}
                          />
                          {user.EGN || "-"}
                        </Box>
                      </TableCell>
                      <TableCell onClick={() => handleViewUser(user.id)}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <SchoolIcon
                            sx={{ mr: 1, color: "info.main", fontSize: 20 }}
                          />
                          <Chip
                            label={user.enrolledCourseName || "Не е записан"}
                            size="small"
                            color={
                              user.enrolledCourseName ? "primary" : "default"
                            }
                            variant={
                              user.enrolledCourseName ? "filled" : "outlined"
                            }
                          />
                        </Box>
                      </TableCell>
                      <TableCell onClick={() => handleViewUser(user.id)}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <BusinessIcon
                            sx={{
                              mr: 1,
                              color: "text.secondary",
                              fontSize: 20,
                            }}
                          />
                          {user.companyName || "-"}
                        </Box>
                      </TableCell>
                      <TableCell onClick={() => handleViewUser(user.id)}>
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Преглед на потребителя">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ViewIcon />}
                            onClick={() => handleViewUser(user.id)}
                          >
                            Преглед
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Редове на страница:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} от ${count}`
              }
            />
          </>
        )}

        {/* No users message */}
        {!loading && users.length === 0 && (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              {searchTerm
                ? "Няма намерени потребители"
                : "Няма регистрирани потребители"}
            </Typography>
            {searchTerm && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{ mt: 2 }}
              >
                Покажи всички потребители
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}
