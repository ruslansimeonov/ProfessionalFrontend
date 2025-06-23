"use client";

import { trpc } from "@/lib/trpc";

// Migration wrapper: Convert tRPC responses to match your existing API format
// This allows gradual migration without breaking existing components

export interface LegacyApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LegacyGroup {
  id: number;
  name: string;
  description?: string | null;
  companyId?: number | null;
  maxParticipants: number;
  currentParticipants: number;
  status: string;
  registrationDeadline?: Date | null;
  isRegistrationOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
  companyName?: string | null;
}

export interface LegacyPaginatedGroups {
  groups: LegacyGroup[];
  total: number;
  page: number;
  pageSize: number;
}

// Wrapper functions that convert tRPC to legacy API format
export function useLegacyGroupsAPI() {
  const trpcUtils = trpc.useContext();
  const createGroupMutation = trpc.groups.create.useMutation();
  const updateGroupMutation = trpc.groups.update.useMutation();
  const deleteGroupMutation = trpc.groups.delete.useMutation();
  const addUsersToGroupMutation = trpc.groups.addUsers.useMutation();

  const getGroups = async (
    page: number = 1,
    pageSize: number = 10,
    searchTerm?: string
  ): Promise<LegacyApiResponse<LegacyPaginatedGroups>> => {
    try {
      const data = await trpcUtils.groups.getAll.fetch({
        page,
        pageSize,
        search: searchTerm,
      });

      return {
        success: true,
        data: {
          groups: data.groups.map((group) => ({
            ...group,
            description: group.description || undefined,
            companyId: group.companyId || undefined,
            registrationDeadline: group.registrationDeadline
              ? new Date(group.registrationDeadline)
              : null,
            createdAt: new Date(group.createdAt),
            updatedAt: new Date(group.updatedAt),
          })),
          total: data.total,
          page: data.page,
          pageSize: data.pageSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch groups",
      };
    }
  };

  const getGroupById = async (
    groupId: number
  ): Promise<LegacyApiResponse<LegacyGroup>> => {
    try {
      const data = await trpcUtils.groups.getById.fetch({ id: groupId });

      return {
        success: true,
        data: {
          ...data,
          description: data.description || undefined,
          companyId: data.companyId || undefined,
          registrationDeadline: data.registrationDeadline
            ? new Date(data.registrationDeadline)
            : null,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch group",
      };
    }
  };

  const createGroup = async (data: {
    name: string;
    companyId: string | number;
  }): Promise<LegacyApiResponse<LegacyGroup>> => {
    try {
      const result = await createGroupMutation.mutateAsync({
        name: data.name,
        companyId:
          typeof data.companyId === "string"
            ? parseInt(data.companyId)
            : data.companyId,
      });

      return {
        success: true,
        data: {
          ...result,
          description: result.description || undefined,
          companyId: result.companyId || undefined,
          registrationDeadline: result.registrationDeadline
            ? new Date(result.registrationDeadline)
            : null,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt),
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create group",
      };
    }
  };

  const updateGroup = async (
    groupId: number,
    data: {
      name: string;
      companyId?: number | null;
    }
  ): Promise<LegacyApiResponse<LegacyGroup>> => {
    try {
      const result = await updateGroupMutation.mutateAsync({
        id: groupId,
        name: data.name,
        companyId: data.companyId || undefined,
      });

      return {
        success: true,
        data: {
          ...result,
          description: result.description || undefined,
          companyId: result.companyId || undefined,
          registrationDeadline: result.registrationDeadline
            ? new Date(result.registrationDeadline)
            : null,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt),
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update group",
      };
    }
  };

  const deleteGroup = async (
    groupId: number
  ): Promise<LegacyApiResponse<void>> => {
    try {
      await deleteGroupMutation.mutateAsync({ id: groupId });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete group",
      };
    }
  };

  const getGroupCapacity = async (groupId: number) => {
    try {
      const capacity = await trpcUtils.groups.getCapacity.fetch({ groupId });
      return {
        success: true,
        data: { capacity },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get group capacity",
      };
    }
  };

  const addUsersToGroup = async (
    groupId: number,
    userIds: number[]
  ): Promise<LegacyApiResponse<void>> => {
    try {
      await addUsersToGroupMutation.mutateAsync({ groupId, userIds });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to add users to group",
      };
    }
  };

  const fetchAvailableUsersForGroup = async (
    groupId: number,
    page: number,
    rowsPerPage: number,
    search?: string
  ) => {
    try {
      const result = await trpcUtils.groups.getAvailableUsers.fetch({
        groupId,
        page,
        pageSize: rowsPerPage,
        search,
      });

      return {
        users: result.users,
        total: result.total,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch available users"
      );
    }
  };

  const getGroupUsersWithDocumentStatus = async (groupId: number) => {
    try {
      const result = await trpcUtils.groups.getUsersWithDocumentStatus.fetch({
        groupId,
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get users with document status",
      };
    }
  };

  return {
    getGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupCapacity,
    addUsersToGroup,
    fetchAvailableUsersForGroup,
    getGroupUsersWithDocumentStatus,
  };
}
