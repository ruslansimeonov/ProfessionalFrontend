import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

interface SearchHeaderProps {
  title: string;
  searchTerm: string;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  onClear: () => void;
  placeholder?: string;
  labels?: {
    search?: string;
    refresh?: string;
  };
}

export function SearchHeader({
  title,
  searchTerm,
  loading,
  onSearchChange,
  onSearch,
  onRefresh,
  onClear,
  placeholder = "Search...",
  labels = {
    search: "Search",
    refresh: "Refresh",
  },
}: SearchHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 3,
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <PersonIcon sx={{ mr: 1 }} />
        {title}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          size="small"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={onClear}>
                    ×
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: 300, ml: 2 }}
        />
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          disabled={loading}
        >
          {labels.search}
        </Button>
        <Tooltip title={labels.refresh}>
          <IconButton color="primary" onClick={onRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
