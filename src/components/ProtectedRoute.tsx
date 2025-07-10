import { Navigate } from "react-router-dom";
import { useAuth, type UserRole } from "@/context/AuthContext";
import Loading from "@/components/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, userRole, initializing, loading } = useAuth();

  if (initializing || loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on user's actual role
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
  }

  return <>{children}</>;
};
