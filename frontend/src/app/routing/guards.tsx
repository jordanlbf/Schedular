import { Navigate, Outlet, useLocation } from "react-router-dom";
import { paths } from "./paths";

// Stubbed auth hook - no real auth implementation found
const useAuth = () => ({ user: null, loading: false });

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to={paths.home()} state={{ from: location }} replace />;
  return <Outlet />;
}

export function RequireRole({ role }: { role: "admin" | "staff" | string }) {
  const { user } = useAuth();
  if (!user || !Array.isArray((user as any).roles) || !(user as any).roles.includes(role)) {
    return <Navigate to={paths.home()} replace />;
  }
  return <Outlet />;
}