import axios from "axios";

// Import API methods from other files
export * from "./auth";
export * from "./users";
export * from "./companies";
export * from "./groups";
export * from "./messages";

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
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ✅ Centralized API Error Handler
export function handleApiError(error: unknown): ApiErrorResponse {
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
