import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import Landing from "@/pages/Landing";
import Overview from "@/pages/Protected/Overview";
import Settings from "@/pages/Protected/Settings";
import { Loader } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import Users from "@/pages/Protected/Users";
import SchoolYear from "@/pages/Protected/SchoolYear";
import Announcements from "./pages/Protected/Announcements";
import Attendance from "./pages/Protected/Attendance";
import Groups from "./pages/Protected/Groups";
import Children from "./pages/Protected/Children";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  const { user, userRole, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  // Role-based redirect logic
  const getRoleBasedRedirect = () => {
    if (!user) return <Landing />;

    switch (userRole) {
      case "admin":
        return <Navigate to="/dashboard" replace />;
      case "teacher":
        return <Navigate to="/announcement" replace />;
      case "parent":
        return <Navigate to="/announcement" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={getRoleBasedRedirect()} />

      <Route
        path="/*"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher", "parent"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Admin Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Overview />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="school-year"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SchoolYear />
            </ProtectedRoute>
          }
        />
        <Route
          path="attendance"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher"]}>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="announcement"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "parent"]}>
              <Announcements />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "parent"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="groups"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "parent"]}>
              <Groups />
            </ProtectedRoute>
          }
        />

        {/* Parent Routes */}
        <Route
          path="children"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <Children />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster richColors />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
