import { useState, useCallback, useEffect } from "react";
import { Group, User } from "../utils/types/types";
import { getGroups, getGroupUsers } from "../utils/apis/groups";

export function useGroups(initialPage = 1, initialPageSize = 10) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupUsers, setGroupUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const loadGroups = useCallback(
    async (currentPage = page, currentPageSize = pageSize, searchTerm = "") => {
      try {
        setLoading(true);
        const response = await getGroups(
          currentPage,
          currentPageSize,
          searchTerm
        );

        if (response.success && response.data) {
          const {
            groups: fetchedGroups,
            total: totalCount,
            page: responsePage,
          } = response.data;
          setGroups(fetchedGroups);
          setTotal(totalCount);
          setPage(responsePage);
        } else {
          setError("Failed to load groups");
        }
      } catch (err) {
        setError("Failed to load groups");
        console.error("Load groups error:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  const handleGroupSelect = useCallback(async (groupId: number) => {
    try {
      setLoadingUsers(true);
      const response = await getGroupUsers(groupId);
      if ("data" in response) {
        setGroupUsers(response.data);
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Failed to load group users:", error);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      loadGroups(newPage, pageSize);
    },
    [pageSize, loadGroups]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      setPage(1);
      loadGroups(1, newPageSize);
    },
    [loadGroups]
  );

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  return {
    groups,
    groupUsers,
    loading,
    loadingUsers,
    error,
    page,
    pageSize,
    total,
    handlePageChange,
    handlePageSizeChange,
    loadGroups,
    handleGroupSelect,
  };
}
