import { getAuthToken } from "../helpers";
import { AuthenticatedUserResponse } from "../types";
import { api, ApiResponse, handleApiError } from "./api";

// ✅ Register a User
export async function registerUser(data: {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  courseId: number;
  cityId: number;
  username: string;
  email: string;
  password: string;
}): Promise<ApiResponse<{ message: string }>> {
  try {
    const response = await api.post<{ message: string }>(
      "/api/auth/register",
      data
    );
    return { success: true, data: response.data, error: "" };
  } catch (error) {
    return handleApiError(error);
  }
}

// ✅ Login a User
export async function loginUser(data: {
  emailOrUsername: string;
  password: string;
}): Promise<ApiResponse<{ token: string }>> {
  try {
    const response = await api.post<{ token: string }>("/api/auth/login", data);

    console.log("🔑 Login response:", response); // Debugging
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // Store token in `localStorage`
      console.log("✅ Token saved in localStorage:", response.data.token); // Debugging
    } else {
      console.error("🚨 Login successful but no token received!");
    }

    return { success: true, data: response.data, error: "" };
  } catch (error) {
    return handleApiError(error);
  }
}

// ✅ Get the authenticated user
export async function getAuthenticatedUser(): Promise<ApiResponse<AuthenticatedUserResponse>> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: "No token found" };
    }

    const { data } = await api.get<AuthenticatedUserResponse>("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data, error: "" };
  } catch (error) {
    return handleApiError(error);
  }
}
