import { useState, useEffect } from "react";
import { api, registerUser } from "../utils/apis/api";
import { useRouter } from "next/navigation";
import { useStore } from "../store/useStore";

// Define interfaces for the hook
export interface Course {
  id: number;
  courseName: string;
  courseType: string;
  courseHours: number;
  coursePrice: string | null;
}

export interface City {
  id: number;
  cityName: string;
}

export interface RegistrationData {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  courseId: number;
  cityId: number;
  username: string;
  email: string;
  password: string;
}

export interface RegistrationFormData {
  fullName: string;
  phoneNumber: string;
  courseId: number;
  cityId: number;
  email: string;
  password: string;
}

export function useCourseRegistration() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState({
    courses: true,
    cities: true,
    submission: false,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { login } = useStore();
  const router = useRouter();

  // Fetch courses and cities
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        setLoading((prev) => ({ ...prev, courses: true }));
        const coursesResponse = await api.get("/api/public/courses");
        setCourses(coursesResponse.data);
        setLoading((prev) => ({ ...prev, courses: false }));

        // Fetch cities
        setLoading((prev) => ({ ...prev, cities: true }));
        const citiesResponse = await api.get("/api/public/cities");
        setCities(citiesResponse.data);
        setLoading((prev) => ({ ...prev, cities: false }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage(
          "Failed to load courses or cities. Please try again later."
        );
        setLoading((prev) => ({ ...prev, courses: false, cities: false }));
      }
    };

    fetchData();
  }, []);

  // Name parser utility
  const parseFullName = (fullName: string) => {
    const nameParts = fullName.trim().split(/\s+/); // Splitting by spaces
    return {
      firstName: nameParts[0] || "",
      middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "",
      lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
    };
  };

  // Form submission handler
  const handleRegistration = async (formData: RegistrationFormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading((prev) => ({ ...prev, submission: true }));

    try {
      const { firstName, middleName, lastName } = parseFullName(
        formData.fullName
      );

      // Prepare data for API
      const registrationData: RegistrationData = {
        firstName,
        middleName,
        lastName,
        phoneNumber: formData.phoneNumber,
        courseId: formData.courseId,
        cityId: formData.cityId,
        username: formData.email,
        email: formData.email,
        password: formData.password,
      };

      const result = await registerUser(registrationData);

      if (result.success) {
        setSuccessMessage("Успешна регистрация! Влизане в профила...");

        // Use the updated login method with the correct payload
        const loginResult = await login({
          emailOrUsername: formData.email,
          password: formData.password,
        });

        if (loginResult) {
          router.push("/profile");
        } else {
          setErrorMessage(
            "Успешна регистрация, но неуспешно влизане. Моля, опитайте да влезете ръчно."
          );
          setTimeout(() => router.push("/login"), 3000);
        }
      } else {
        setErrorMessage(result.error || "Възникна грешка при регистрацията.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Възникна неочаквана грешка."
      );
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  // Custom validator for full name
  const validateFullName = (value: string) => {
    // Check if the name is empty
    if (!value.trim()) {
      return "Моля, въведете вашите имена.";
    }

    // Check for three name parts
    const parts = value.trim().split(/\s+/);
    if (parts.length < 3) {
      return "Моля, въведете три имена (пример: Иван Петров Иванов).";
    }

    // Check for Cyrillic characters
    const cyrillicPattern = /^[\u0410-\u044F\s-]+$/; // Cyrillic Unicode range plus spaces and hyphens
    if (!cyrillicPattern.test(value)) {
      return "Моля, използвайте само букви от кирилицата за вашите имена.";
    }

    // Check minimum length for each name part
    const hasShortParts = parts.some((part) => part.length < 2);
    if (hasShortParts) {
      return "Всяко име трябва да съдържа поне 2 символа.";
    }

    return true;
  };

  return {
    courses,
    cities,
    loading,
    errorMessage,
    successMessage,
    handleRegistration,
    validateFullName,
    clearMessages: () => {
      setErrorMessage(null);
      setSuccessMessage(null);
    },
  };
}
