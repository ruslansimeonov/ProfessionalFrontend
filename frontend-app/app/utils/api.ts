import axios from "axios";
import { Company, User, Group } from "./types"; // Ensure types exist

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
  data?: never;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ✅ Centralized API Error Handler
function handleApiError(error: unknown): ApiErrorResponse {
  let errorMessage: string = "Something went wrong. Please try again.";

  if (axios.isAxiosError(error)) {
    if (error.response) {
      errorMessage =
        typeof error.response.data?.error === "string"
          ? error.response.data.error
          : "An unknown error occurred on the server.";
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
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

// ✅ Fetch all users
export async function getUsers(): Promise<ApiResponse<User[]>> {
  try {
    const { data } = await api.get<User[]>("/api/users");
    return { success: true, data, error: "" };
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

// ✅ Fetch server message
export async function getServerMessage(): Promise<ApiResponse<string>> {
  try {
    const { data } = await api.get<{ message: string }>("/");
    return { success: true, data: data.message, error: "" };
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

// ✅ Fetch all companies
export async function getCompanies(): Promise<ApiResponse<Company[]>> {
  try {
    const { data } = await api.get<Company[]>("/api/companies");
    return { success: true, data, error: "" };
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

// ✅ Fetch all groups
export async function getGroups(): Promise<ApiResponse<Group[]>> {
  try {
    const { data } = await api.get<Group[]>("/api/groups");
    return { success: true, data, error: "" };
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
