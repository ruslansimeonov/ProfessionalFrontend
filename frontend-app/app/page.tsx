"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Avatar,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Description as DocumentIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Groups as GroupsIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import { useStore } from "./store/useStore";
import Link from "next/link";
import { getServerMessage } from "./utils/apis/api";

// Types for dashboard data
interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  pendingDocuments: number;
  activeGroups: number;
}

interface RecentActivity {
  id: number;
  type:
    | "user_registration"
    | "document_upload"
    | "course_enrollment"
    | "group_creation";
  description: string;
  timestamp: string;
  user?: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: "primary" | "secondary" | "success" | "warning" | "info";
  requiredRole?: string[];
}

export default function HomePage() {
  // const { t } = useTranslation();
  const { isAuthenticated, user } = useStore();
  // const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [serverMessage, setServerMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    pendingDocuments: 0,
    activeGroups: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  // Client-side only rendering
  useEffect(() => {
    setIsMounted(true);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load server message
      const response = await getServerMessage();
      if (response.success) {
        setServerMessage(response.data);
      }

      // Mock dashboard stats - replace with actual API calls
      setDashboardStats({
        totalUsers: 247,
        totalCourses: 12,
        pendingDocuments: 18,
        activeGroups: 8,
      });

      // Mock recent activity - replace with actual API calls
      setRecentActivity([
        {
          id: 1,
          type: "user_registration",
          description: "Нов потребител се регистрира за курс мостов кран",
          timestamp: "2 часа преди",
          user: "Иван Петров",
        },
        {
          id: 2,
          type: "document_upload",
          description: "Качени документи за одобрение",
          timestamp: "4 часа преди",
          user: "Мария Георгиева",
        },
        {
          id: 3,
          type: "course_enrollment",
          description: "Записване в курс за мотокар",
          timestamp: "1 ден преди",
          user: "Георги Димитров",
        },
      ]);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Define quick actions based on user role
  const getQuickActions = (): QuickAction[] => {
    const baseActions: QuickAction[] = [
      {
        title: "Моят профил",
        description: "Управление на лична информация и документи",
        icon: <AssignmentIcon />,
        href: "/profile",
        color: "primary",
      },
    ];

    if (!isAuthenticated) {
      return [
        {
          title: "Вход в системата",
          description: "Влезте в профила си",
          icon: <DashboardIcon />,
          href: "/login",
          color: "primary",
        },
        {
          title: "Регистрация",
          description: "Създайте нов профил и се запишете за курс",
          icon: <AddIcon />,
          href: "/register",
          color: "success",
        },
      ];
    }

    if (user?.role === "Admin") {
      return [
        ...baseActions,
        {
          title: "Управление на потребители",
          description:
            "Преглед и управление на всички регистрирани потребители",
          icon: <PeopleIcon />,
          href: "/officePortal",
          color: "secondary",
          requiredRole: ["Admin"],
        },
        {
          title: "Управление на групи",
          description: "Създаване и управление на групи за курсове",
          icon: <GroupsIcon />,
          href: "/groups",
          color: "info",
          requiredRole: ["Admin"],
        },
        {
          title: "Фирми",
          description: "Управление на фирми и техните служители",
          icon: <BusinessIcon />,
          href: "/companies",
          color: "warning",
          requiredRole: ["Admin"],
        },
      ];
    }

    if (user?.role === "Company") {
      return [
        ...baseActions,
        {
          title: "Служители",
          description: "Управление на служителите от вашата фирма",
          icon: <WorkIcon />,
          href: "/companyPortal",
          color: "info",
          requiredRole: ["Company"],
        },
      ];
    }

    return baseActions;
  };

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "user_registration":
        return <PeopleIcon color="primary" />;
      case "document_upload":
        return <DocumentIcon color="warning" />;
      case "course_enrollment":
        return <SchoolIcon color="success" />;
      case "group_creation":
        return <GroupsIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const renderWelcomeSection = () => (
    <Paper
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
        color: "white",
        p: 4,
        mb: 4,
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      />
      <Grid container spacing={3} alignItems="center">
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {isAuthenticated
              ? `Добре дошли, ${user?.details?.firstName || "Потребител"}!`
              : "Добре дошли в нашата система"}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            {isAuthenticated
              ? "Управлявайте вашите курсове, документи и сертификати от едно място"
              : "Системата за управление на курсове за строителна техника"}
          </Typography>
          {serverMessage && (
            <Alert
              severity="info"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "white",
                "& .MuiAlert-icon": { color: "white" },
              }}
            >
              {serverMessage}
            </Alert>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: "center" }}>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <DashboardIcon sx={{ fontSize: 60 }} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderStatsCards = () => {
    if (!isAuthenticated || user?.role !== "Admin") return null;

    const stats = [
      {
        title: "Общо потребители",
        value: dashboardStats.totalUsers,
        icon: <PeopleIcon />,
        color: "#1976d2",
        trend: "+12%",
      },
      {
        title: "Активни курсове",
        value: dashboardStats.totalCourses,
        icon: <SchoolIcon />,
        color: "#2e7d32",
        trend: "+3%",
      },
      {
        title: "Документи за одобрение",
        value: dashboardStats.pendingDocuments,
        icon: <DocumentIcon />,
        color: "#ed6c02",
        trend: "-5%",
      },
      {
        title: "Активни групи",
        value: dashboardStats.activeGroups,
        icon: <GroupsIcon />,
        color: "#9c27b0",
        trend: "+8%",
      },
    ];

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card elevation={2} sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ backgroundColor: stat.color, mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: 700 }}
                    >
                      {loading ? <Skeleton width={40} /> : stat.value}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TrendingUpIcon fontSize="small" color="success" />
                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{ ml: 0.5 }}
                  >
                    {stat.trend} от миналия месец
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderQuickActions = () => {
    const quickActions = getQuickActions();

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            Бързи действия
          </Typography>
        </Grid>
        {quickActions.map((action, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              component={Link}
              href={action.href}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: `${action.color}.main`,
                      mr: 2,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {action.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ ml: "auto" }}
                >
                  Отваряне
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderRecentActivity = () => {
    if (!isAuthenticated) return null;

    return (
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <NotificationsIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h3">
                Последна активност
              </Typography>
            </Box>
            <List>
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Skeleton variant="circular" width={40} height={40} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Skeleton width="60%" />}
                        secondary={<Skeleton width="40%" />}
                      />
                    </ListItem>
                  ))
                : recentActivity.map((activity, index) => (
                    <ListItem
                      key={activity.id}
                      divider={index < recentActivity.length - 1}
                    >
                      <ListItemIcon>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.description}
                        // Fix: Use custom secondary content that doesn't create a <p> tag
                        secondary={null}
                        secondaryTypographyProps={{
                          component: "div", // This forces it to render as div instead of p
                        }}
                      />
                      {/* Render the secondary content manually */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="span"
                        >
                          {activity.timestamp}
                        </Typography>
                        {activity.user && (
                          <Chip
                            label={activity.user}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </ListItem>
                  ))}
            </List>
          </Paper>
        </Grid>

        {/* Profile Completion / Quick Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {isAuthenticated ? "Състояние на профила" : "Започнете днес"}
            </Typography>
            {isAuthenticated ? (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">
                      Завършеност на профила
                    </Typography>
                    <Typography variant="body2">75%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{ height: 8 }}
                  />
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Лични данни" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <WarningIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText primary="Документи (2 остават)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Записване в курс" />
                  </ListItem>
                </List>
                <Button
                  variant="outlined"
                  fullWidth
                  component={Link}
                  href="/profile"
                  sx={{ mt: 2 }}
                >
                  Довършете профила
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Създайте профил и започнете обучението за строителна техника
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Курсове за мотокар" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Курсове за багер" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Курсове за кран" />
                  </ListItem>
                </List>
                <Button
                  variant="contained"
                  fullWidth
                  component={Link}
                  href="/register"
                  sx={{ mt: 2 }}
                >
                  Започнете сега
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Skeleton variant="rectangular" height={150} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      {renderWelcomeSection()}

      {/* Statistics Cards (Admin only) */}
      {renderStatsCards()}

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Recent Activity & Profile Status */}
      {renderRecentActivity()}
    </Container>
  );
}
