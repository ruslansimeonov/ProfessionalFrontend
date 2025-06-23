"use client";

import { trpc } from "@/lib/trpc";
import { useCallback } from "react";

export function useGroupManagementTRPC(groupId: number | null) {
  // Get group details
  const {
    data: group,
    isLoading: groupLoading,
    error: groupError,
    refetch: refetchGroup,
  } = trpc.groups.getById.useQuery({ id: groupId! }, { enabled: !!groupId });

  // Get group capacity
  const {
    data: capacity,
    isLoading: capacityLoading,
    refetch: refetchCapacity,
  } = trpc.groups.getCapacity.useQuery(
    { groupId: groupId! },
    { enabled: !!groupId }
  );

  // Get group invitations
  const {
    data: invitations,
    isLoading: invitationsLoading,
    refetch: refetchInvitations,
  } = trpc.groups.getInvitations.useQuery(
    { groupId: groupId! },
    { enabled: !!groupId }
  );

  // Get users with document status
const {
  data: usersWithDocumentStatus,
  isLoading: usersLoading,
  refetch: refetchUsers,
} = trpc.groups.getUsersWithDocumentStatus.useQuery(
  { groupId: groupId! },
  { 
    enabled: groupId !== null && groupId !== undefined,
    retry: false, // Don't retry failed requests
    // Prevent double calls with staleTime
    staleTime: 30000, // Consider data fresh for 30 seconds
  }
);

  // Mutations
  const createInvitationMutation = trpc.groups.createInvitation.useMutation({
    onSuccess: () => {
      refetchInvitations();
      refetchCapacity();
    },
  });

  const deactivateInvitationMutation =
    trpc.groups.deactivateInvitation.useMutation({
      onSuccess: () => {
        refetchInvitations();
      },
    });

  const addUsersMutation = trpc.groups.addUsers.useMutation({
    onSuccess: () => {
      refetchUsers();
      refetchCapacity();
    },
  });

  const updateStatusMutation = trpc.groups.updateStatus.useMutation({
    onSuccess: () => {
      refetchGroup();
      refetchCapacity();
    },
  });

  // Helper functions
  const createInvitation = useCallback(
    async (data: {
      description?: string;
      maxUses?: number;
      expiresAt: Date;
    }) => {
      if (!groupId) throw new Error("Group ID is required");
      return createInvitationMutation.mutateAsync({
        groupId,
        ...data,
      });
    },
    [groupId, createInvitationMutation]
  );

  const deactivateInvitation = useCallback(
    async (invitationId: number) => {
      return deactivateInvitationMutation.mutateAsync({ invitationId });
    },
    [deactivateInvitationMutation]
  );

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

  const updateStatus = useCallback(
    async (
      status: "active" | "full" | "closed" | "completed" | "cancelled"
    ) => {
      if (!groupId) throw new Error("Group ID is required");
      return updateStatusMutation.mutateAsync({
        id: groupId,
        status: status,
      });
    },
    [groupId, updateStatusMutation]
  );

  return {
    // Data
    group,
    capacity,
    invitations: invitations || [],
    usersWithDocumentStatus: usersWithDocumentStatus?.users || [],
    documentSummary: usersWithDocumentStatus?.summary,

    // Loading states
    groupLoading,
    capacityLoading,
    invitationsLoading,
    usersLoading,

    // Error states
    groupError: groupError?.message || null,

    // Mutation states
    creatingInvitation: createInvitationMutation.isPending,
    deactivatingInvitation: deactivateInvitationMutation.isPending,
    addingUsers: addUsersMutation.isPending,
    updatingStatus: updateStatusMutation.isPending,

    // Actions
    createInvitation,
    deactivateInvitation,
    addUsers,
    updateStatus,
    refetchGroup,
    refetchCapacity,
    refetchInvitations,
    refetchUsers,
  };
}
