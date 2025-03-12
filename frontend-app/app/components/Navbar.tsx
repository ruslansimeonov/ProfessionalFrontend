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
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  HowToReg as RegisterIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated, toggleSidebar, logout, user } = useStore();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const router = useRouter();

  // Check if user is admin
  const isAdmin = user?.role === "Admin";

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    router.push("/"); // Redirect to homepage
    logout();
    handleMenuClose(); // Close the menu if open
  };

  // Navigate to profile and close menu
  const handleProfileClick = () => {
    router.push("/profile");
    handleMenuClose();
  };

  // Navigate to office portal and close menu
  const handleOfficePortalClick = () => {
    router.push("/officePortal");
    handleMenuClose();
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
        {/* Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button
            color="inherit"
            component={Link}
            href="/"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                component={Link}
                href="/profile"
                startIcon={<PersonIcon />}
              >
                Profile
              </Button>
              {/* Show Office Portal link for admins */}
              {isAdmin && (
                <Button
                  color="inherit"
                  component={Link}
                  href="/officePortal"
                  startIcon={<DashboardIcon />}
                  sx={{
                    backgroundColor: "primary.dark",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                      opacity: 0.9,
                    },
                  }}
                >
                  Office Portal
                </Button>
              )}
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ color: "error.light" }}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                href="/login"
                startIcon={<LoginIcon />}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                href="/register"
                variant="outlined"
                startIcon={<RegisterIcon />}
              >
                Register
              </Button>
            </>
          )}
        </Box>
        {/* Profile Menu */}
        {isAuthenticated && (
          <Box sx={{ ml: 2 }}>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{
                border: "2px solid rgba(255,255,255,0.3)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                elevation: 3,
                sx: {
                  minWidth: "200px",
                  mt: 1.5,
                  "& .MuiMenuItem-root": {
                    py: 1,
                  },
                },
              }}
            >
              {user?.details && (
                <Box sx={{ px: 2, py: 1, textAlign: "center" }}>
                  <AccountCircle
                    sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                  />
                  <Box sx={{ fontWeight: "bold" }}>
                    {`${user.details.firstName} ${user.details.lastName}`}
                  </Box>
                  <Box
                    sx={{ fontSize: "0.8rem", color: "text.secondary", mb: 1 }}
                  >
                    {user.details.email}
                  </Box>
                  <Divider />
                </Box>
              )}
              <MenuItem
                onClick={handleProfileClick}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <PersonIcon fontSize="small" />
                Моят профил
              </MenuItem>

              {/* Office Portal menu item for admins */}
              {isAdmin && (
                <MenuItem
                  onClick={handleOfficePortalClick}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <AdminIcon fontSize="small" />
                  Офис портал
                </MenuItem>
              )}

              <Divider />
              <MenuItem
                onClick={handleLogout}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "error.main",
                }}
              >
                <LogoutIcon fontSize="small" />
                Изход
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
