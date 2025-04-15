import { getAuthToken } from "../tokenHelpers";
import { Group } from "../types/types";
import { api, ApiResponse, handleApiError } from "./api";

// ✅ Fetch all groups (requires authentication)
export async function getGroups(): Promise<ApiResponse<Group[]>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const { data } = await api.get<Group[]>("/api/groups", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data, error: "" };
  } catch (error) {
    return handleApiError(error);
  }
}
