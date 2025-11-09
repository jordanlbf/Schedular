import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, type UserRole } from "@/core/auth";
import { paths } from "./paths";

/**
 * Route guard that requires authentication
 * Redirects to login page if user is not authenticated
 */
export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

/**
 * Route guard that requires a specific role
 * Redirects to home if user doesn't have the required role
 */
export function RequireRole({ role }: { role: UserRole }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== role) {
    return <Navigate to={paths.home()} replace />;
  }

  return <Outlet />;
}