"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { searchCompanies } from "@/app/utils/apis/companies";
import { Company } from "@/app/utils/types/types";

interface CompanyAutocompleteProps {
  value: Company | null;
  onChange: (company: Company | null) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function CompanyAutocomplete({
  value,
  onChange,
  label = "Company",
  placeholder = "Search by company name or ID...",
  error = false,
  helperText,
  disabled = false,
  required = false,
}: CompanyAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleSearch = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setOptions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await searchCompanies(searchTerm);

      if (response.success && response.data) {
        setOptions(response.data.companies || []);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error("Error searching companies:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (event: React.SyntheticEvent, newInputValue: string) => {
      setInputValue(newInputValue);

      // Clear existing timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      // Debounce search
      const timeout = setTimeout(() => {
        handleSearch(newInputValue);
      }, 300);

      setSearchTimeout(timeout);
    },
    [handleSearch, searchTimeout]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string"
          ? option
          : `${option.companyName} (ID: ${option.id})`
      }
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={loading}
      disabled={disabled}
      filterOptions={(x) => x} // Disable built-in filtering since we handle it server-side
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          required={required}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                <SearchIcon color="action" />
              </Box>
            ),
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}
        >
          <BusinessIcon color="primary" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight="medium">
              {option.companyName}
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
            >
              <Chip
                label={`ID: ${option.id}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem", height: "20px" }}
              />
              <Chip
                label={option.taxNumber}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem", height: "20px" }}
              />
              <Chip
                label={option.status}
                size="small"
                color={option.status === "active" ? "success" : "default"}
                sx={{ fontSize: "0.75rem", height: "20px" }}
              />
            </Box>
          </Box>
        </Box>
      )}
      noOptionsText={
        inputValue.length < 2
          ? "Type at least 2 characters to search..."
          : loading
          ? "Searching..."
          : "No companies found"
      }
      sx={{ minWidth: 300 }}
    />
  );
}
