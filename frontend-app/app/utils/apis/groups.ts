import { getAuthToken } from "../tokenHelpers";
import { Group, User } from "../types/types";
import { api, ApiResponse, handleApiError } from "./api";

export interface PaginatedGroups {
  groups: Group[];
  total: number;
  page: number;
  pageSize: number;
}

interface CreateGroupData {
  name: string;
  companyId: string | number;
}

export async function getGroups(
  page: number = 1,
  pageSize: number = 10,
  searchTerm?: string
): Promise<ApiResponse<PaginatedGroups>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const { data } = await api.get<PaginatedGroups>("/api/groups", {
      params: { page, pageSize, search: searchTerm },
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getGroupUsers(
  groupId: number
): Promise<ApiResponse<User[]>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const { data } = await api.get<User[]>(`/api/groups/${groupId}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createGroup(
  data: CreateGroupData
): Promise<ApiResponse<Group>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const { data: responseData } = await api.post<Group>("/api/groups", data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: responseData };
  } catch (error) {
    return handleApiError(error);
  }
}



export async function addUsersToGroup(
  groupId: number,
  userIds: number[]
): Promise<ApiResponse<void>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const { data } = await api.post(
      `/api/groups/${groupId}/users`,
      { userIds },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}
