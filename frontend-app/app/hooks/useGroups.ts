// app/hooks/useGroups.ts
import { useState, useCallback, useEffect, useRef } from "react";
import { getGroups } from "@/app/utils/apis/groups";
import { Group } from "../utils/types/types";

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Add ref to track ongoing requests
  const loadingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadGroups = useCallback(
    async (
      currentPage: number = page,
      currentPageSize: number = pageSize,
      search: string = ""
    ) => {
      // Prevent multiple simultaneous calls
      if (loadingRef.current) {
        console.log("Groups already loading, skipping...");
        return;
      }

      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        loadingRef.current = true;
        setLoading(true);
        setError(null);

        console.log("Loading groups:", {
          currentPage,
          currentPageSize,
          search,
        });

        const response = await getGroups(currentPage, currentPageSize, search);

        // Check if request was aborted
        if (abortController.signal.aborted) {
          return;
        }

        if (response.success && response.data) {
          setGroups(response.data.groups || []);
          setTotal(response.data.total || 0);
          setPage(currentPage);
          setPageSize(currentPageSize);
        } else {
          setError("Failed to load groups");
        }
      } catch (err) {
        if (abortController.signal.aborted) {
          return; // Request was cancelled, don't set error
        }

        console.error("Load groups error:", err);
        setError("Failed to load groups");
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
          loadingRef.current = false;
        }
      }
    },
    [page, pageSize] // Remove from dependencies to prevent loops
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
        loadGroups(1, newPageSize); // Reset to first page
      }
    },
    [loadGroups, pageSize]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      loadingRef.current = false;
    };
  }, []);

  return {
    groups,
    loading,
    error,
    page,
    pageSize,
    total,
    loadGroups,
    handlePageChange,
    handlePageSizeChange,
  };
}
