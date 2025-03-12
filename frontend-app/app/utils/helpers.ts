import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null; // Prevent errors during SSR
  }

  const token = localStorage.getItem("token");
  return token ? token : null;
}

// Updated helper function in app/utils/helpers.ts
export async function handleUserAuth(
  credentials: { emailOrUsername: string; password: string },
  loginFunction: (credentials: {
    emailOrUsername: string;
    password: string;
  }) => Promise<boolean>,
  router: AppRouterInstance,
  setError: (error: string | null) => void
): Promise<boolean> {
  try {
    const success = await loginFunction(credentials);

    if (success) {
      router.push("/profile");
      return true;
    } else {
      setError("Неуспешно влизане. Моля, проверете вашите данни.");
      return false;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    setError(
      error instanceof Error ? error.message : "Възникна грешка при влизане."
    );
    return false;
  }
}
