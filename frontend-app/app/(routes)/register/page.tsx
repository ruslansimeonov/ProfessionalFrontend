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
} from "@mui/material";
import { registerUser } from "../../utils/apis/api"; // Import API function
import { RegisterForm } from "@/app/utils/types/types";
import { handleUserAuth } from "@/app/utils/helpers";
import { useStore } from "@/app/store/useStore";

// For demonstration, define a Course type
interface Course {
  id: number;
  courseName: string;
}

// New city type (for the nearest city dropdown)
interface City {
  id: number;
  name: string;
}

// Extend your form type with our new fields
interface ExtendedRegisterForm extends RegisterForm {
  fullName: string;
  phoneNumber: string;
  courseId: number;
  cityId: number; // Nearest city
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
  const { login } = useStore(); // Zustand function

  const router = useRouter();

  // Mock fetching courses and cities from the backend
  useEffect(() => {
    // Example: fetch("/api/courses").then(...)
    setCourses([
      { id: 1, courseName: "Курс за мотокар" },
      { id: 2, courseName: "Курс за багер" },
      { id: 3, courseName: "Курс за заваряване" },
    ]);

    // Example: fetch("/api/cities").then(...)
    setCities([
      { id: 1, name: "София" },
      { id: 2, name: "Пловдив" },
      { id: 3, name: "Варна" },
      { id: 4, name: "Бургас" },
    ]);
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
          <FormControl fullWidth margin="normal" error={!!errors.courseId}>
            <InputLabel id="course-label">Изберете курс</InputLabel>
            <Select
              labelId="course-label"
              label="Изберете курс"
              defaultValue=""
              {...register("courseId", { required: "Изберете курс" })}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.courseName}
                </MenuItem>
              ))}
            </Select>
            {errors.courseId && (
              <Typography color="error" variant="caption">
                {errors.courseId.message}
              </Typography>
            )}
          </FormControl>

          {/* Nearest City Select */}
          <FormControl fullWidth margin="normal" error={!!errors.cityId}>
            <InputLabel id="city-label">Най-близък град</InputLabel>
            <Select
              labelId="city-label"
              label="Най-близък град"
              defaultValue=""
              {...register("cityId", { required: "Моля, изберете град" })}
            >
              {cities.map((city) => (
                <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>
              ))}
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

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Записване
          </Button>
        </form>
      </Box>
    </Container>
  );
}
