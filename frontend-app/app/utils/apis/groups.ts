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

export async function fetchAvailableUsersForGroup(
  groupId: number,
  page: number,
  rowsPerPage: number,
  search?: string
): Promise<{ users: User[]; total: number }> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const apiUrl = `${baseUrl}/api/groups/${groupId}/available-users`;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: rowsPerPage.toString(),
    });

    if (search && search.trim() !== "") {
      queryParams.append("search", search);
    }

    const response = await fetch(`${apiUrl}?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      users: data.users,
      total: data.pagination.total,
    };
  } catch (error) {
    console.error("Error fetching available users for group:", error);
    throw error;
  }
}

export async function getGroupUsersWithDocumentStatus(groupId: number): Promise<
  ApiResponse<{
    users: User[];
    total: number;
    groupId: number;
    summary: {
      totalUsers: number;
      completeDocuments: number;
      incompleteDocuments: number;
      unknownDocuments: number;
      completionPercentage: number;
    };
    timestamp: string;
  }>
> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const { data } = await api.get(
      `/api/groups/${groupId}/users-with-document-status`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to get group users with document status:", error);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Failed to load group users with document status",
    };
  }
}
