import { Box, Typography, Button } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

interface StateMessagesProps {
  error?: string | null;
  isEmpty?: boolean;
  hasSearch?: boolean;
  onRefresh: () => void;
  labels?: {
    tryAgain: string;
    noResults: string;
    noUsers: string;
    showAll: string;
  };
}

export function StateMessages({
  error,
  isEmpty,
  hasSearch,
  onRefresh,
  labels = {
    tryAgain: "Try Again",
    noResults: "No users found",
    noUsers: "No users registered",
    showAll: "Show all users",
  },
}: StateMessagesProps) {
  if (error) {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          sx={{ mt: 1 }}
        >
          {labels.tryAgain}
        </Button>
      </Box>
    );
  }

  if (isEmpty) {
    return (
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h6" color="text.secondary">
          {hasSearch ? labels.noResults : labels.noUsers}
        </Typography>
        {hasSearch && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            sx={{ mt: 2 }}
          >
            {labels.showAll}
          </Button>
        )}
      </Box>
    );
  }

  return null;
}
