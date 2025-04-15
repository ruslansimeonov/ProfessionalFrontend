import { getAuthToken } from "../tokenHelpers";
import { User } from "../types/types";
import { api, ApiResponse, handleApiError } from "./api";

/**
 * ✅ Upload user documents
 */
export async function uploadUserDocuments(data: {
  userId: string;
  files: File[];
  docTypeNames: string[];
}): Promise<
  ApiResponse<{
    user: User;
    documents: { documentType: string; documentUrl: string }[];
  }>
> {
  const token = getAuthToken();
  if (!token) {
    return { success: false, error: "No token found" };
  }

  try {
    console.log("🚀 Data to be uploaded:", data); // Log raw input data

    const formData = new FormData();

    // ✅ Append user details
    formData.append("userId", data.userId);

    // ✅ Append each file with its document type
    data.files.forEach((file, index) => {
      if (!file) {
        console.warn(`⚠️ Skipping empty file at index ${index}`);
        return;
      }
      formData.append("files", file);
      formData.append("docTypeNames", data.docTypeNames[index]);
    });

    // ✅ Debugging FormData - Log all values
    console.log("📂 FormData Entries:");
    for (const pair of formData.entries()) {
      console.log(`🔹 ${pair[0]}:`, pair[1]);
    }

    // ✅ Make API request (multipart form-data)
    const response = await api.post("/api/upload/files", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Upload response:", response);

    return { success: true, data: response.data, error: "" };
  } catch (error) {
    console.error("❌ Error uploading documents:", error);
    return handleApiError(error);
  }
}

/**
 * ✅ Delete user document
 */
export async function deleteUserDocument(
  userId: string,
  documentId: number
): Promise<ApiResponse<{ success: boolean; message?: string }>> {
  const token = getAuthToken();
  if (!token) {
    return { success: false, error: "No token found" };
  }

  try {
    const response = await api.delete(
      `/api/users/${userId}/documents/${documentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data: response.data, error: "" };
  } catch (error) {
    console.error("❌ Error deleting document:", error);
    return handleApiError(error);
  }
}
