import { api, ApiResponse, handleApiError } from "./api";

// ✅ Fetch server message
export async function getServerMessage(): Promise<ApiResponse<string>> {
  try {
    const { data } = await api.get<{ message: string }>("/");
    return { success: true, data: data.message };
  } catch (error) {
    return handleApiError(error);
  }
}
