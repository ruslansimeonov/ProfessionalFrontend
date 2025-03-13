"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { RegisterForm, registerUser } from "../../utils/apis/api"; // Import API function
import { useStore } from "@/app/store/useStore";
import { api } from "@/app/utils/apis/api"; // Make sure this import is correct for your project

// Update the Course interface to match backend response
interface Course {
  id: number;
  courseName: string;
  courseType: string;
  courseHours: number;
  coursePrice: string | null;
  // Add other fields as needed
}

// City interface to match backend
interface City {
  id: number;
  cityName: string; // Update this to match the backend field name
}

// Extend your form type with our new fields
interface ExtendedRegisterForm extends RegisterForm {
  fullName: string;
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExtendedRegisterForm>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState({
    courses: true,
    cities: true,
  });
  const { login } = useStore(); // Zustand function

  const router = useRouter();

  // Fetch courses and cities from our backend API
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
        setLoading({ courses: false, cities: false });
      }
    };

    fetchData();
  }, []);

  // Custom validator to ensure user typed exactly three parts (First Middle Last).
  const validateFullName = (value: string) => {
    const parts = value.trim().split(/\s+/);
    return (
      parts.length === 3 ||
      "Моля, въведете три имена (пример: Иван Петров Иванов)."
    );
  };

  const onSubmit = async (data: ExtendedRegisterForm) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const nameParts = data.fullName.trim().split(/\s+/); // Splitting by spaces

    const firstName = nameParts[0] || ""; // First word
    const middleName =
      nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : ""; // All words in the middle
    const lastName =
      nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""; // Last word

    try {
      // Match the structure expected by the updated backend
      const registerData = {
        firstName,
        middleName,
        lastName,
        phoneNumber: data.phoneNumber,
        courseId: data.courseId,
        cityId: data.cityId,
        username: data.email, // using email as username
        email: data.email,
        password: data.password,
      };

      const result = await registerUser(registerData);

      if (result.success) {
        setSuccessMessage("Успешна регистрация! Влизане в профила...");

        // Use the updated login method with the correct payload
        const loginResult = await login({
          emailOrUsername: data.email,
          password: data.password,
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
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h4" textAlign="center" gutterBottom>
          Записване за Курс
        </Typography>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name (3 parts) */}
          <TextField
            fullWidth
            label="Име (Три имена)"
            margin="normal"
            {...register("fullName", {
              required: "Моля, въведете трите си имена.",
              validate: validateFullName,
            })}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />

          {/* Phone Number */}
          <TextField
            fullWidth
            label="Телефон"
            margin="normal"
            {...register("phoneNumber", {
              required: "Телефонът е задължителен",
              pattern: {
                value: /^[0-9+\-()\s]{6,20}$/,
                message: "Моля, въведете валиден телефонен номер",
              },
            })}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
          />

          {/* Course Select */}
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.courseId}
            disabled={loading.courses}
          >
            <InputLabel id="course-label">Изберете курс</InputLabel>
            <Select
              labelId="course-label"
              label="Изберете курс"
              defaultValue=""
              {...register("courseId", { required: "Изберете курс" })}
            >
              {loading.courses ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 2 }} />
                  Зареждане...
                </MenuItem>
              ) : (
                courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.courseName} ({course.courseType})
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.courseId && (
              <Typography color="error" variant="caption">
                {errors.courseId.message}
              </Typography>
            )}
          </FormControl>

          {/* Nearest City Select */}
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.cityId}
            disabled={loading.cities}
          >
            <InputLabel id="city-label">Най-близък град</InputLabel>
            <Select
              labelId="city-label"
              label="Най-близък град"
              defaultValue=""
              {...register("cityId", { required: "Моля, изберете град" })}
            >
              {loading.cities ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 2 }} />
                  Зареждане...
                </MenuItem>
              ) : (
                cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.cityName} {/* Update to match backend field name */}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.cityId && (
              <Typography color="error" variant="caption">
                {errors.cityId.message}
              </Typography>
            )}
          </FormControl>

          {/* Email (username) */}
          <TextField
            fullWidth
            label="Имейл (за вход)"
            type="email"
            margin="normal"
            {...register("email", {
              required: "Имейлът е задължителен",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Невалиден имейл формат",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Password Field */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <TextField
              fullWidth
              label="Парола"
              type="password"
              {...register("password", {
                required: "Паролата е задължителна",
                minLength: {
                  value: 6,
                  message: "Паролата трябва да е поне 6 символа",
                },
              })}
              error={!!errors.password}
              helperText={
                errors.password?.message ||
                "Използвайте парола, за да имате достъп до учебните материали и да прикачвате документи."
              }
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading.courses || loading.cities}
          >
            {loading.courses || loading.cities ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                Зареждане...
              </>
            ) : (
              "Записване"
            )}
          </Button>
        </form>
      </Box>
    </Container>
  );
}
