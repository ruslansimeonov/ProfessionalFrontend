import { useState, useCallback } from "react";
import { User } from "@/app/utils/types/types";
import {
  fetchRegisteredUsers,
  fetchCompanyUsers,
} from "@/app/utils/apis/users";

interface UseLoadUsersOptions {
  companyId?: number;
  initialPage?: number;
  initialRowsPerPage?: number;
  isCompanyView?: boolean;
}

interface UseLoadUsersReturn {
  users: User[];
  total: number;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  setSearchTerm: (search: string) => void;
  loadUsers: (
    pageNum?: number,
    rowsNum?: number,
    search?: string
  ) => Promise<void>;
  handleSearch: () => void;
  handleRefresh: () => void;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useLoadUsers = ({
  companyId,
  initialPage = 0,
  initialRowsPerPage = 10,
  isCompanyView = false,
}: UseLoadUsersOptions = {}): UseLoadUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = useCallback(
    async (
      pageNum: number = page,
      rowsNum: number = rowsPerPage,
      search: string = searchTerm
    ) => {
      setLoading(true);
      setError(null);

      try {
        const { users: fetchedUsers, total: totalCount } = isCompanyView
          ? await fetchCompanyUsers(companyId!, pageNum, rowsNum, search)
          : await fetchRegisteredUsers(pageNum, rowsNum, search);

        setUsers(fetchedUsers);
        setTotal(totalCount);
      } catch (err: unknown) {
        setError(
          `Error loading users: ${
            err instanceof Error ? err.message : "Please try again"
          }`
        );
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, rowsPerPage, searchTerm, companyId, isCompanyView]
  );

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    setPage(0);
    loadUsers(0, rowsPerPage, searchTerm);
  };

  const handleRefresh = () => {
    setPage(0);
    setSearchTerm("");
    loadUsers(0, rowsPerPage, "");
  };

  return {
    users,
    total,
    page,
    rowsPerPage,
    loading,
    error,
    searchTerm,
    setPage,
    setRowsPerPage,
    setSearchTerm,
    loadUsers,
    handleSearch,
    handleRefresh,
    handleChangePage,
    handleChangeRowsPerPage,
  };
};
