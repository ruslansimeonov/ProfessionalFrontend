"use client";

import { useStore } from "../store/useStore";
import { useTranslation } from "react-i18next"; // Add this import
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

const StyledDrawer = styled(Drawer)({
  flexShrink: 0,
  whiteSpace: "nowrap",
  "& .MuiDrawer-paper": {
    transition: "width 225ms cubic-bezier(0.4, 0, 0.2, 1)",
    overflowX: "hidden",
  },
});

export default function Sidebar() {
  const { t } = useTranslation(); // Add this hook
  const { isSidebarOpen, toggleSidebar } = useStore();
  const isMobile = useMediaQuery("(max-width: 900px)");

  // Define menu items with translation keys
  const menuItems = [
    { text: t("navigation.dashboard"), icon: <HomeIcon /> },
    { text: t("navigation.courses"), icon: <SchoolIcon /> },
    { text: t("navigation.archives"), icon: <ArchiveIcon /> },
    { text: t("navigation.settings"), icon: <SettingsIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Drawer */}
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
}
