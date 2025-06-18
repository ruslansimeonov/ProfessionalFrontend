import { getAuthToken } from "../tokenHelpers";
import { GroupInvitation, GroupCapacity, Group } from "../types/types";
import { api, ApiResponse, handleApiError } from "./api";

/**
 * Create a group invitation code
 */
export async function createGroupInvitation(
  groupId: number,
  data: {
    description?: string;
    maxUses?: number;
    expiresAt: string; // ISO string
  }
): Promise<ApiResponse<{ invitation: GroupInvitation }>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    console.log("Creating group invitation:", { groupId, data });

    const { data: responseData } = await api.post(
      `/api/groups/${groupId}/invitations`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Create group invitation error:", error);
    return handleApiError(error);
  }
}

/**
 * Get group invitations
 */
export async function getGroupInvitations(
  groupId: number
): Promise<ApiResponse<GroupInvitation[]>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const { data } = await api.get<{ invitations: GroupInvitation[] }>(
      `/api/groups/${groupId}/invitations`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data: data.invitations };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Deactivate a group invitation code
 */
export async function deactivateGroupInvitation(
  invitationId: number
): Promise<ApiResponse<{ invitation: GroupInvitation }>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const { data } = await api.put<{ invitation: GroupInvitation }>(
      `/api/groups/invitations/${invitationId}/deactivate`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get group capacity information
 */
export async function getGroupCapacity(
  groupId: number
): Promise<ApiResponse<{ capacity: GroupCapacity }>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const { data } = await api.get<{ capacity: GroupCapacity }>(
      `/api/groups/${groupId}/capacity`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Update group status
 */
export async function updateGroupStatus(
  groupId: number,
  status: string
): Promise<ApiResponse<{ group: Group }>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const { data } = await api.put(
      `/api/groups/${groupId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Validate group invitation code (public)
 */
export async function validateGroupInvitation(code: string): Promise<
  ApiResponse<{
    valid: boolean;
    error?: string;
    group?: {
      id: number;
      name: string;
      description?: string;
      capacity: GroupCapacity;
      company?: { id: number; name: string };
    };
  }>
> {
  try {
    const { data } = await api.get(
      `/api/public/groups/invitation/${code}/validate`
    );
    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Use group invitation code during registration (public)
 */
export async function useGroupInvitation(
  invitationCode: string,
  userId: number
): Promise<
  ApiResponse<{
    groupId: number;
    groupName: string;
    companyId?: number;
    message: string;
  }>
> {
  try {
    const { data } = await api.post("/api/public/groups/use-invitation", {
      invitationCode,
      userId,
    });

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}
