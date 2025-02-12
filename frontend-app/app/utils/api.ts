import axios from "axios";
import { Company, User, Group } from "./types"; // Ensure types exist
import { getAuthToken } from "./helpers"; // Import reusable function

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create an axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ API Response Interfaces
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  error: "";
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ✅ Centralized API Error Handler
function handleApiError(error: unknown): ApiErrorResponse {
  let errorMessage = "Something went wrong. Please try again.";

  if (axios.isAxiosError(error)) {
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.request) {
      errorMessage = "No response from the server. Please try again later.";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  if (process.env.NODE_ENV === "development") {
    console.error("[API Error]", errorMessage);
  }

  return { success: false, error: errorMessage };
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

// ✅ Fetch server message
export async function getServerMessage(): Promise<ApiResponse<string>> {
  try {
    const { data } = await api.get<{ message: string }>("/");
    return { success: true, data: data.message, error: "" };
  } catch (error) {
    return handleApiError(error);
  }
}

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

// ✅ Register a User
export async function registerUser(data: {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
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
