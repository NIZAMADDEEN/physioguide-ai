/**
 * Application-wide constants
 */

// API
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
export const API_TIMEOUT = 15000;

// Route paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  EXERCISES: "/exercises",
  MONITORING: "/monitoring",
  ANALYTICS: "/analytics",
  REPORTS: "/reports",
  PROFILE: "/profile",
};

// Chart color palette (from design tokens)
export const CHART_COLORS = {
  primary: "#004e9f",
  primaryLight: "rgba(0, 78, 159, 0.12)",
  secondary: "#006b5f",
  secondaryLight: "rgba(0, 107, 95, 0.12)",
  accent: "#3cddc7",
  accentLight: "rgba(60, 221, 199, 0.15)",
  tertiary: "#883700",
  tertiaryLight: "rgba(136, 55, 0, 0.12)",
  error: "#ba1a1a",
  errorLight: "rgba(186, 26, 26, 0.12)",
  surface: "#f8f9ff",
  outline: "#c1c6d5",
  text: "#0b1c30",
  textDim: "#414753",
};

// Sidebar navigation items
export const SIDEBAR_NAV = [
  { label: "Dashboard", icon: "dashboard", path: ROUTES.DASHBOARD },
  { label: "Exercises", icon: "fitness_center", path: ROUTES.EXERCISES },
  // { label: "Live Monitoring", icon: "videocam", path: ROUTES.MONITORING },
  { label: "Analytics", icon: "analytics", path: ROUTES.ANALYTICS },
  { label: "Reports", icon: "clinical_notes", path: ROUTES.REPORTS },
  { label: "Profile", icon: "person", path: ROUTES.PROFILE },
  { label: "Home", icon: "home", path: ROUTES.HOME },
];

// Status variants
export const STATUS = {
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  HIGH_PRIORITY: "high_priority",
  SCHEDULED: "scheduled",
  CANCELLED: "cancelled",
};
