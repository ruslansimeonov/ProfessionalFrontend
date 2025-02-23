"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "../store/useStore";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";

export default function Navbar() {
  const { isAuthenticated, toggleSidebar, logout } = useStore();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 2 }}>
      <Toolbar>
        {/* Sidebar Toggle */}
        <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
        {/* Logo */}
        <Link href="/" passHref>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Image src="/next.svg" alt="Company Logo" width={120} height={40} />
          </Box>
        </Link>
        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />
        Navigation Links
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} href="/">
            🏠 Home
          </Button>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} href="/routes/profile">
                👤 Profile
              </Button>
              <Button color="inherit" onClick={logout} sx={{ color: "red" }}>
                🚪 Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} href="/routes/login">
                🔑 Login
              </Button>
              <Button color="inherit" component={Link} href="/routes/register">
                📝 Register
              </Button>
            </>
          )}
        </Box>
        {/* Profile Menu */}
        {isAuthenticated && (
          <Box sx={{ ml: 2 }}>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={handleMenuClose}
                component={Link}
                href="/routes/profile"
              >
                Profile
              </MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
