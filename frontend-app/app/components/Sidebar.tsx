"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Archive as ArchiveIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const drawerWidth = 230;
const collapsedWidth = 60;

// Move styled component outside of the component to avoid re-creation
const StyledDrawer = styled(Drawer)({
  flexShrink: 0,
  whiteSpace: "nowrap",
  "& .MuiDrawer-paper": {
    transition: "width 225ms cubic-bezier(0.4, 0, 0.2, 1)",
    overflowX: "hidden",
  },
});

// Move this outside to avoid recreating on each render
const menuItemsConfig = [
  { key: "dashboard", icon: <HomeIcon />, href: "/" },
  { key: "courses", icon: <SchoolIcon />, href: "/courses" },
  { key: "archives", icon: <ArchiveIcon />, href: "/archives" },
  { key: "settings", icon: <SettingsIcon />, href: "/settings" },
];

export default function Sidebar() {
  // ALWAYS declare all hooks at the top level, in the same order
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation();
  const { isSidebarOpen, toggleSidebar } = useStore();
  const theme = useTheme();
  
  // Always call useMediaQuery even during SSR, with a default value
  const isMobileQuery = useMediaQuery(theme.breakpoints.down('md'));
  
  // Only use the result of useMediaQuery when mounted
  const isMobile = isMounted ? isMobileQuery : false;

  // Set mounted state after first render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prepare menu items with translations
  const menuItems = menuItemsConfig.map(item => ({
    ...item,
    text: t(`navigation.${item.key}`),
  }));

  // Determine what to render
  const renderContent = () => {
    if (!isMounted) {
      // During SSR or first client render, return minimal placeholder
      return (
        <Box
          sx={{
            width: collapsedWidth,
            height: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            background: "#f5f5f5",
            borderRight: "1px solid #ddd",
            display: { xs: "none", md: "block" },
          }}
        />
      );
    }

    // Once mounted on client, return full component
    return (
      <Box sx={{ display: "flex" }}>
        <StyledDrawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isSidebarOpen || !isMobile}
          onClose={isMobile ? toggleSidebar : undefined}
          sx={{
            zIndex: 1,
            width: isSidebarOpen ? drawerWidth : collapsedWidth,
            "& .MuiDrawer-paper": {
              width: isSidebarOpen ? drawerWidth : collapsedWidth,
              boxShadow: isMobile ? "0px 4px 10px rgba(0, 0, 0, 0.3)" : "none",
            },
          }}
        >
          {/* Logo and Toggle Button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: isSidebarOpen ? "space-between" : "center",
              padding: "10px",
              borderBottom: "1px solid #ddd",
              paddingTop: isMobile ? "40px" : "0px",
            }}
          >
            {!isMobile && (
              <IconButton onClick={toggleSidebar}>
                {isSidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
            )}
          </Box>

          <Divider />

          {/* Sidebar Menu */}
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <Tooltip
                  title={!isSidebarOpen ? item.text : ""}
                  placement="right"
                >
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    sx={{
                      display: "flex",
                      justifyContent: isSidebarOpen ? "flex-start" : "center",
                      alignItems: "center",
                      px: isSidebarOpen ? 2 : 0,
                      minHeight: 56,
                      width: "100%",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.text}
                      sx={{
                        display: isSidebarOpen ? "block" : "none",
                        ml: isSidebarOpen ? 1 : 0,
                        whiteSpace: "nowrap",
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </StyledDrawer>
      </Box>
    );
  };

  // Final return - always the same structure
  return renderContent();
}