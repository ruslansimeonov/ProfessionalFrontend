import React from "react";
import { Button, CircularProgress } from "@mui/material";

interface SubmitButtonProps {
  isLoading: boolean;
  text?: string;
  loadingText?: string;
}

export default function SubmitButton({
  isLoading,
  text = "Записване",
  loadingText = "Зареждане...",
}: SubmitButtonProps) {
  return (
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
          {loadingText}
        </>
      ) : (
        text
      )}
    </Button>
  );
}
