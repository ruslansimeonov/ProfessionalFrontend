import { useState, useCallback, useRef } from "react";
import { getGroups } from "@/app/utils/apis/groups";
import { Group } from "../utils/types/types";

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // Simple loading ref to prevent concurrent calls
  const loadingRef = useRef(false);

  const loadGroups = useCallback(
    async (
      currentPage: number = 1,
      currentPageSize: number = 10,
      search: string = ""
    ) => {
      // Prevent multiple simultaneous calls
      if (loadingRef.current) {
        console.log("Groups already loading, skipping...");
        return;
      }

      try {
        loadingRef.current = true;
        setLoading(true);
        setError(null);

        console.log("🔵 Loading groups:", {
          currentPage,
          currentPageSize,
          search,
        });

        const response = await getGroups(currentPage, currentPageSize, search);

        console.log("🎯 Response received:", response);

        if (response.success && response.data) {
          const { groups: responseGroups, total: responseTotal } =
            response.data;

          console.log("✅ Setting state:", {
            groupsCount: responseGroups?.length || 0,
            total: responseTotal || 0,
          });

          setGroups(responseGroups || []);
          setTotal(responseTotal || 0);
          setPage(currentPage);
          setPageSize(currentPageSize);
          setInitialized(true);

          console.log("🏁 State updated successfully");
        } else {
          console.error("❌ API response error:");
          setError("Failed to load groups");
          setGroups([]);
          setTotal(0);
        }
      } catch (err) {
        console.error("💥 Exception:", err);
        setError("Failed to load groups");
        setGroups([]);
        setTotal(0);
      } finally {
        console.log("🔄 Cleaning up...");
        setLoading(false);
        loadingRef.current = false;
      }
    },
    []
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage !== page && !loadingRef.current) {
        loadGroups(newPage, pageSize);
      }
    },
    [loadGroups, page, pageSize]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      if (newPageSize !== pageSize && !loadingRef.current) {
        loadGroups(1, newPageSize);
      }
    },
    [loadGroups, pageSize]
  );

  return {
    groups,
    loading,
    error,
    page,
    pageSize,
    total,
    initialized,
    loadGroups,
    handlePageChange,
    handlePageSizeChange,
  };
}
