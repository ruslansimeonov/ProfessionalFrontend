import { getAuthToken } from "../tokenHelpers";
import { UserDetails } from "../types/types";
import { ApiResponse, api, handleApiError } from "./api";
import { ProfileUpdateData } from "./users";

/**
 * Update user profile as admin
 */
export async function updateUserProfileAsAdmin(
  userId: number,
  profileData: ProfileUpdateData
): Promise<ApiResponse<UserDetails>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const response = await api.put(
      `/api/users/${userId}/profile`,
      profileData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return {
      success: true,
      data: response.data.user,
    };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return handleApiError(error);
  }
}

/**
 * Reset user password as admin
 */
export async function adminResetUserPassword(
  userId: number,
  newPassword: string
): Promise<ApiResponse<string>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    await api.post(`/api/admin/users/${userId}/reset-password`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        newPassword: newPassword,
      },
    });

    return { success: true, data: "" };
  } catch (error) {
    console.error("Failed to reset password:", error);
    return handleApiError(error);
  }
}

/**
 * Suspend user as admin
 */
export async function suspendUser(
  userId: number
): Promise<ApiResponse<string>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    await api.post(`/api/admin/users/${userId}/suspend`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: "" };
  } catch (error) {
    console.error("Failed to suspend user:", error);
    return handleApiError(error);
  }
}
