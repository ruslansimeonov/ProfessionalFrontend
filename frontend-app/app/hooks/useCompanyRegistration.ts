import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  registerCompany,
  type CompanyRegistrationData,
} from "../utils/apis/companies";

export function useCompanyRegistration() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleRegistration = async (data: CompanyRegistrationData) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const result = await registerCompany(data);

      if (result.success) {
        setSuccessMessage(
          "Company registration submitted successfully! You will be notified once approved."
        );
        // Redirect after successful registration
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setErrorMessage(result.error || "Registration failed");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorMessage,
    successMessage,
    handleRegistration,
  };
}
