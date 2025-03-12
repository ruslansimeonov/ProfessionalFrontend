import { getAuthToken } from "../helpers";
import {
  Certificate,
  Company,
  EnrolledCourse,
  User,
  Document,
  UserDetails,
  Roles,
} from "../types/types";
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
      error: "",
    };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return handleApiError(error);
  }
}

/**
 * Get user profile information
 */
export async function getUserProfile(): Promise<ApiResponse<UserDetails>> {
  try {
    const response = await api.get("/api/profile");

    return {
      success: true,
      data: response.data.user,
      error: "",
    };
  } catch (error) {
    return handleApiError(error);
  }
}

export interface AuthenticatedUserResponse {
  user: UserDetails; // This is correct as the API returns user details here
  company: Company | null;
  enrolledCourses: EnrolledCourse[];
  documents: Document[];
  certificates: Certificate[];
  role: Roles;
}

// ✅ Get the authenticated user
export async function getAuthenticatedUser(): Promise<
  ApiResponse<AuthenticatedUserResponse>
> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const { data } = await api.get<AuthenticatedUserResponse>("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data, error: "" };
  } catch (error) {
    return handleApiError(error);
  }
}
