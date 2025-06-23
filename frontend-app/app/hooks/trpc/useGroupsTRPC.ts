"use client";

import { trpc } from "@/lib/trpc";
import { useState, useCallback } from "react";

interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
}

export function useGroupsTRPC() {
  const [currentParams, setCurrentParams] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
    search: undefined,
  });

  // Queries
  const {
    data: groupsData,
    isLoading,
    error,
    refetch,
  } = trpc.groups.getAll.useQuery(currentParams);

  // Mutations
  const createGroupMutation = trpc.groups.create.useMutation({
    onSuccess: () => {
      refetch(); // Refetch groups after creating
    },
  });

  const updateGroupMutation = trpc.groups.update.useMutation({
    onSuccess: () => {
      refetch(); // Refetch groups after updating
    },
  });

  const deleteGroupMutation = trpc.groups.delete.useMutation({
    onSuccess: () => {
      refetch(); // Refetch groups after deleting
    },
  });

  // Helper functions
  const loadGroups = useCallback((params: PaginationParams) => {
    setCurrentParams(params);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentParams((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setCurrentParams((prev) => ({
      ...prev,
      search: search || undefined,
      page: 1,
    }));
  }, []);

  const createGroup = useCallback(
    async (input: {
      name: string;
      companyId: number;
      description?: string;
      maxParticipants?: number;
      registrationDeadline?: Date;
    }) => {
      return createGroupMutation.mutateAsync(input);
    },
    [createGroupMutation]
  );

  const updateGroup = useCallback(
    async (
      id: number,
      data: {
        name?: string;
        companyId?: number;
      }
    ) => {
      return updateGroupMutation.mutateAsync({ id, ...data });
    },
    [updateGroupMutation]
  );

  const deleteGroup = useCallback(
    async (id: number) => {
      return deleteGroupMutation.mutateAsync({ id });
    },
    [deleteGroupMutation]
  );

  return {
    // Data
    groups: groupsData?.groups || [],
    total: groupsData?.total || 0,
    page: groupsData?.page || 1,
    pageSize: groupsData?.pageSize || 10,

    // States
    loading: isLoading,
    error: error?.message || null,

    // Mutation states
    creating: createGroupMutation.isPending,
    updating: updateGroupMutation.isPending,
    deleting: deleteGroupMutation.isPending,

    // Actions
    loadGroups,
    handlePageChange,
    handleSearchChange,
    createGroup,
    updateGroup,
    deleteGroup,
    refetch,
  };
}
