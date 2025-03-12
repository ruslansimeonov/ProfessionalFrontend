import { getAuthToken } from "../helpers";
import { Company } from "../types/types";
import { api, ApiResponse, handleApiError } from "./api";

// ✅ Fetch all companies (requires authentication)
export async function getCompanies(): Promise<ApiResponse<Company[]>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const { data } = await api.get<Company[]>("/api/companies", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data, error: "" };
  } catch (error) {
    return handleApiError(error);
  }
}
