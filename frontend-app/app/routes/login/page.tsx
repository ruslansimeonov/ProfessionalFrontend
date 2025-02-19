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
import { loginUser } from "../../utils/apis/api"; // Import API function
import { useStore } from "@/app/store/useStore";
import { LoginForm } from "@/app/utils/types";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useStore();
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    setErrorMessage(null);

    console.log("🔑 Login form data:", data); // Debugging
    const result = await loginUser(data);
    console.log("🔑 Login result:", result); // Debugging

    if (result.success && result.data?.token) {
      await login(data); // Call Zustand's login function to update the state
      router.push("/"); // Redirect to home page after login
    } else {
      setErrorMessage(result.error || "Invalid credentials");
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
          Login
        </Typography>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email or Username"
            {...register("emailOrUsername", {
              required: "This field is required",
            })}
            error={!!errors.emailOrUsername}
            helperText={errors.emailOrUsername?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}
