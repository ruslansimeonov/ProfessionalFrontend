import { getAuthToken } from "../helpers";
import { User } from "../types";
import { api, ApiResponse, handleApiError } from "./api";

/**
 * ✅ Upload user documents (before registration)
 */
export async function uploadUserDocuments(data: {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  files: File[];
}): Promise<
  ApiResponse<{
    user: User;
    documents: { documentType: string; documentUrl: string }[];
  }>
> {
  try {
    const formData = new FormData();

    // ✅ Append user details
    formData.append("firstName", data.firstName);
    formData.append("middleName", data.middleName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    if (data.phoneNumber) {
      formData.append("phoneNumber", data.phoneNumber);
    }

    // ✅ Append each file
    data.files.forEach((file) => {
      formData.append("files", file);
    });

    // ✅ Make API request (no authentication required)
    const response = await api.post("/api/upload/files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log(response);

    return { success: true, data: response.data, error: "" };
  } catch (error) {
    return handleApiError(error);
  }
}

// ✅ Fetch a single user
export async function getUser(userId: number): Promise<ApiResponse<User>> {
  try {
    const { data } = await api.get<User>(`/api/users/${userId}`);
    return { success: true, data, error: "" };
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

    return { success: true, data, error: "" };
  } catch (error) {
    return handleApiError(error);
  }
}
