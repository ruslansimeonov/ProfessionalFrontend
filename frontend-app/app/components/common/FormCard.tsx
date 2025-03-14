import React, { ReactNode } from 'react';
import { Box, Typography, Container, Alert } from '@mui/material';

interface FormCardProps {
  title: string;
  errorMessage?: string | null;
  successMessage?: string | null;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md';
}

export default function FormCard({
  title,
  errorMessage,
  successMessage,
  children,
  maxWidth = 'xs'
}: FormCardProps) {
  return (
    <Container maxWidth={maxWidth}>
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
          {title}
        </Typography>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        {children}
      </Box>
    </Container>
  );
}