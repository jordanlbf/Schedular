import { Navigate } from "react-router-dom";
import { useAuth } from "@/core/auth";
import { paths } from "./paths";

/**
 * Root route handler - redirects based on auth state
 * - Not authenticated → /login
 * - Authenticated → /home
 */
export function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.login()} replace />;
  }

  return <Navigate to={paths.home()} replace />;
}
