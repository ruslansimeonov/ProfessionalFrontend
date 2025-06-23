"use client";

import { trpc } from "@/lib/trpc";
import { useState, useCallback } from "react";

export function useAvailableUsersTRPC(groupId: number | null) {
  const [currentParams, setCurrentParams] = useState({
    page: 1,
    pageSize: 10,
    search: "",
  });

  // Get available users
  const {
    data: availableUsersData,
    isLoading,
    error,
    refetch,
  } = trpc.groups.getAvailableUsers.useQuery(
    {
      groupId: groupId!,
      ...currentParams,
    },
    { enabled: !!groupId }
  );

  // Add users mutation
  const addUsersMutation = trpc.groups.addUsers.useMutation();

  // Helper functions
  const loadUsers = useCallback((page: number, search: string = "") => {
    setCurrentParams((prev) => ({ ...prev, page, search }));
  }, []);

  const addUsers = useCallback(
    async (userIds: number[]) => {
      if (!groupId) throw new Error("Group ID is required");
      return addUsersMutation.mutateAsync({
        groupId,
        userIds,
      });
    },
    [groupId, addUsersMutation]
  );

  return {
    // Data
    users: availableUsersData?.users || [],
    total: availableUsersData?.total || 0,
    pagination: availableUsersData?.pagination,

    // States
    loading: isLoading,
    error: error?.message || null,
    addingUsers: addUsersMutation.isPending,

    // Actions
    loadUsers,
    addUsers,
    refetch,
  };
}
