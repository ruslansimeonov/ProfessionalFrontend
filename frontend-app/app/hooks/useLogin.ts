import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../store/useStore";

export interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

export function useLogin() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useStore();
  const router = useRouter();

  const handleLogin = async (credentials: LoginFormData): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const success = await login(credentials);

      if (success) {
        router.push("/profile");
      } else {
        setErrorMessage("Неуспешно влизане. Моля, проверете вашите данни.");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Възникна грешка при влизане."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    errorMessage,
    isLoading,
    handleLogin,
    clearError: () => setErrorMessage(null),
  };
}
