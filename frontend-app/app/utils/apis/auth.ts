import { api, ApiResponse, handleApiError } from "./api";
import { User } from "../types";

export interface RegisterForm {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  username: string;
  email: string;
  password: string;
  courseId: number;
  cityId: number;
}

export interface RegisteredUserResponse {
  message: string;
  user: User; // Using User type from types.ts instead of 'any'
}

// ✅ Register a User
export async function registerUser(
  data: RegisterForm
): Promise<ApiResponse<RegisteredUserResponse>> {
  try {
    const response = await api.post<RegisteredUserResponse>(
      "/api/auth/register",
      data
    );

    return {
      success: true,
      data: response.data,
      error: "", // Add the missing error field
    };
  } catch (error) {
    return handleApiError(error);
  }
}

// Define the LoginRequest interface
export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

// Define the LoginResponse interface
export interface LoginResponse {
  token: string;
}

// ✅ Login a User
export async function loginUser(
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await api.post<LoginResponse>("/api/auth/login", data);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    } else {
      console.error("🚨 Login successful but no token received!");
    }

    return { success: true, data: response.data, error: "" };
  } catch (error) {
    return handleApiError(error);
  }
}

// ✅ Logout a User
export function logoutUser(): void {
  localStorage.removeItem("token");
}

// ✅ Check if user is logged in
export function isAuthenticated(): boolean {
  return localStorage.getItem("token") !== null;
}
