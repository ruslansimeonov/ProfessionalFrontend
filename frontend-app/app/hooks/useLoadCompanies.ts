import { useState, useCallback } from "react";
import { getCompanies } from "@/app/utils/apis/companies";
import { Company } from "@/app/utils/types/types";

export function useLoadCompanies() {
  // Initialize with empty array instead of undefined
  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadCompanies = useCallback(
    async (
      currentPage: number,
      currentRowsPerPage: number,
      search?: string
    ) => {
      setLoading(true);
      setError(null);

      try {
        console.log("Loading companies with params:", {
          page: currentPage + 1,
          limit: currentRowsPerPage,
          search,
        });

        const response = await getCompanies({
          page: currentPage + 1, // API expects 1-based page
          limit: currentRowsPerPage,
          search: search || undefined,
        });

        console.log("API Response:", response);

        if (response.success && response.data) {
          console.log("Setting companies:", response.data.companies);
          setCompanies(response.data.companies || []);
          setTotal(response.data.total || 0);
        } else {
          const errorMessage = !response.success
            ? "API request failed"
            : "Failed to load companies";
          console.error("API Error:", errorMessage);
          setError(errorMessage);
          setCompanies([]);
          setTotal(0);
        }
      } catch (err) {
        console.error("Load companies error:", err);
        setError("Failed to load companies");
        setCompanies([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSearch = useCallback(() => {
    setPage(0);
    loadCompanies(0, rowsPerPage, searchTerm);
  }, [loadCompanies, rowsPerPage, searchTerm]);

  const handleRefresh = useCallback(() => {
    loadCompanies(page, rowsPerPage, searchTerm);
  }, [loadCompanies, page, rowsPerPage, searchTerm]);

  const handleChangePage = useCallback(
    (event: unknown, newPage: number) => {
      setPage(newPage);
      loadCompanies(newPage, rowsPerPage, searchTerm);
    },
    [loadCompanies, rowsPerPage, searchTerm]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(newRowsPerPage);
      setPage(0);
      loadCompanies(0, newRowsPerPage, searchTerm);
    },
    [loadCompanies, searchTerm]
  );

  return {
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
  };
}
