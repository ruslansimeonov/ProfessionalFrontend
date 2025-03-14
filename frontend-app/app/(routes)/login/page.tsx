"use client";

import { useForm } from "react-hook-form";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useLogin, LoginFormData } from "@/app/hooks/useLogin";
import FormCard from "@/app/components/common/FormCard";

export default function LoginPage() {
  const { errorMessage, isLoading, handleLogin } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  return (
    <FormCard title="Login" errorMessage={errorMessage} maxWidth="xs">
      <form onSubmit={handleSubmit(handleLogin)}>
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
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </FormCard>
  );
}
