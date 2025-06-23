import { useState, useCallback, useRef } from "react";
import { useGroupsTRPC } from "./trpc/useGroupsTRPC";

// Legacy hook that now uses tRPC internally
// This maintains backward compatibility while using type-safe tRPC
export function useGroups() {
  const [searchTerm, setSearchTerm] = useState("");
  const [initialized, setInitialized] = useState(false);
  const initialLoadRef = useRef(false);

  // Use the new tRPC hook
  const {
    groups,
    total,
    page,
    pageSize,
    loading,
    error,
    loadGroups: trpcLoadGroups,
    handlePageChange: trpcHandlePageChange,
  } = useGroupsTRPC();

  const loadGroups = useCallback(
    async (
      currentPage: number = 1,
      currentPageSize: number = 10,
      search: string = ""
    ) => {
      if (initialLoadRef.current) {
        console.log("Groups already loading, skipping...");
        return;
      }

      try {
        initialLoadRef.current = true;
        setSearchTerm(search);

        console.log("🔵 Loading groups with tRPC:", {
          currentPage,
          currentPageSize,
          search,
        });

        // Use tRPC loadGroups
        trpcLoadGroups({
          page: currentPage,
          pageSize: currentPageSize,
          search: search || undefined,
        });

        setInitialized(true);
        console.log("🏁 tRPC groups loaded successfully");
      } catch (err) {
        console.error("💥 tRPC Exception:", err);
      } finally {
        console.log("🔄 Cleaning up...");
        initialLoadRef.current = false;
      }
    },
    [trpcLoadGroups]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage !== page && !loading) {
        trpcHandlePageChange(newPage);
      }
    },
    [trpcHandlePageChange, page, loading]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      if (newPageSize !== pageSize && !loading) {
        trpcLoadGroups({
          page: 1,
          pageSize: newPageSize,
          search: searchTerm || undefined,
        });
      }
    },
    [trpcLoadGroups, pageSize, loading, searchTerm]
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
