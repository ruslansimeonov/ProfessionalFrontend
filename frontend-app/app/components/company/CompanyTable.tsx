"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  TablePagination,
  Typography,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";

interface Company {
  id: number;
  companyName: string;
  taxNumber: string;
  email: string;
  phoneNumber?: string;
  status?: string;
  createdAt: string;
  userCount?: number;
}

interface CompaniesTableProps {
  companies: Company[];
  total: number;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  onViewCompany: (companyId: number) => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CompaniesTable({
  companies,
  total,
  page,
  rowsPerPage,
  onViewCompany,
  onPageChange,
  onRowsPerPageChange,
}: CompaniesTableProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bg-BG");
  };

  // Add defensive check for companies
  const safeCompanies = companies || [];

  if (safeCompanies.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <BusinessIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No companies found
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Company Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tax Number</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Users</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeCompanies.map((company) => (
              <TableRow
                key={company.id}
                sx={{
                  "&:hover": { backgroundColor: "action.hover" },
                  cursor: "pointer",
                }}
                onClick={() => onViewCompany(company.id)}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BusinessIcon fontSize="small" color="primary" />
                    <Typography variant="body2" fontWeight="medium">
                      {company.companyName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                    {company.taxNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{company.email}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {company.phoneNumber || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={company.status || "active"}
                    color={getStatusColor(company.status)}
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {company.userCount || 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(company.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewCompany(company.id);
                    }}
                  >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Rows per page:"
      />
    </Paper>
  );
}
