import { getAuthToken } from "../tokenHelpers";
import { User, UserDetails } from "../types/types";
import { api, ApiResponse, handleApiError } from "./api";

// ✅ Fetch a single user
export async function getUser(userId: number): Promise<ApiResponse<User>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }
    const { data } = await api.get<User>(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

// ✅ Fetch all users (requires authentication)
export async function getUsers(): Promise<ApiResponse<User[]>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const { data } = await api.get<User[]>("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

// Define ProfileUpdateData interface
export interface ProfileUpdateData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  currentResidencyAddress?: string;
  birthPlaceAddress?: string;
  EGN?: string;
  IBAN?: string;
}

/**
 * Update user profile information
 * @param profileData - The profile data to update
 */
export async function updateUserProfile(
  profileData: ProfileUpdateData
): Promise<ApiResponse<UserDetails>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const response = await api.put("/api/users/profile", profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      data: response.data.user,
    };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return handleApiError(error);
  }
}

// ✅ Get the authenticated user
export async function getAuthenticatedUser(): Promise<ApiResponse<User>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const { data } = await api.get<User>("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}

// Update API function to use backend pagination and search
export async function fetchRegisteredUsers(
  page: number,
  rowsPerPage: number,
  search?: string
): Promise<{ users: User[]; total: number }> {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Base URL for your API with query parameters
    const apiUrl = `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    }/api/users`;

    // Add query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: rowsPerPage.toString(),
    });

    if (search && search.trim() !== "") {
      queryParams.append("search", search);
    }

    // Fetch data from the API with query parameters
    console.log("Fetching registered users with params:");

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

    // Parse the response
    const data = await response.json();

    console.log("Fetched users:", data.users);

    return {
      users: data.users,
      total: data.pagination.total,
    };
  } catch (error) {
    console.error("Error fetching registered users:", error);
    throw error;
  }
}

export async function fetchCompanyUsers(
  companyId: number,
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
    const apiUrl = `${baseUrl}/api/companies/${companyId}/users`;

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
    console.log("Fetched company users:", data.users);
    console.log("Total users:", data.pagination.total);
    return {
      users: data.users,
      total: data.pagination.total,
    };
  } catch (error) {
    console.error("Error fetching company users:", error);
    throw error;
  }
}

export async function getAvailableUsers(
  groupId: number
): Promise<ApiResponse<User[]>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const { data } = await api.get<User[]>(
      `/api/groups/${groupId}/available-users`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data };
  } catch (error) {
    return handleApiError(error);
  }
}
