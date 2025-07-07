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
import Overview from "@/pages/dashboard/Overview";
import Students from "@/pages/dashboard/Students";
import Teachers from "@/pages/dashboard/Teachers";
import Classes from "@/pages/dashboard/Classes";
import Schedule from "@/pages/dashboard/Schedule";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
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
        return <Navigate to="/teacher-dashboard" replace />;
      case "parent":
        return <Navigate to="/parent-dashboard" replace />;
      default:
        return <Navigate to="/parent-dashboard" replace />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={getRoleBasedRedirect()} />

      {/* Admin Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="classes" element={<Classes />} />
        <Route path="schedule" element={<Schedule />} />
      </Route>

      {/* Teacher Routes */}
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<div>Teacher Dashboard</div>} />
        <Route path="classes" element={<div>Teacher Classes</div>} />
        <Route path="students" element={<div>Teacher Students</div>} />
        <Route path="attendance" element={<div>Teacher Attendance</div>} />
        <Route path="assignments" element={<div>Teacher Assignments</div>} />
        <Route path="schedule" element={<div>Teacher Schedule</div>} />
        <Route path="messages" element={<div>Teacher Messages</div>} />
      </Route>

      {/* Parent Routes */}
      <Route
        path="/parent-dashboard"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<div>Parent Dashboard</div>} />
        <Route path="children" element={<div>My Children</div>} />
        <Route path="attendance" element={<div>Child Attendance</div>} />
        <Route path="assignments" element={<div>Child Assignments</div>} />
        <Route path="schedule" element={<div>Child Schedule</div>} />
        <Route path="reports" element={<div>Child Reports</div>} />
        <Route path="messages" element={<div>Parent Messages</div>} />
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
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
