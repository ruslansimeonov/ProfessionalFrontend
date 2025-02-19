"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { registerUser } from "../../utils/apis/api"; // Import API function
import { RegisterForm } from "@/app/utils/types";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await registerUser(data);

    if (result.success) {
      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("routes/login"), 2000); // Redirect to login after 2 seconds
    } else {
      setErrorMessage(result.error);
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
          Register
        </Typography>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Username"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
            helperText={errors.username?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email format",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            label="First Name"
            {...register("firstName", { required: "First name is required" })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            {...register("lastName", { required: "Last name is required" })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
}
