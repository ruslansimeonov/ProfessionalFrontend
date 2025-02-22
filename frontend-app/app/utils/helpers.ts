import { LoginForm } from "./types";
import { loginUser } from "./apis/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null; // Prevent errors during SSR
  }

  const token = localStorage.getItem("token");
  return token ? token : null;
}

export const handleUserAuth = async (
  data: LoginForm,
  login: (data: {
    emailOrUsername: string;
    password: string;
  }) => Promise<boolean>, // Correct type
  router: AppRouterInstance,
  setErrorMessage: (message: string | null) => void
) => {
  setErrorMessage(null);

  console.log("🔑 Auth form data:", data);
  const result = await loginUser(data);
  console.log("🔑 Auth result:", result);

  if (result.success && result.data?.token) {
    const isLoggedIn = await login(data);
    if (isLoggedIn) {
      setTimeout(() => router.push("/routes/profile"), 2000);
    }
  } else {
    setErrorMessage(result.error || "Invalid credentials");
  }
};
