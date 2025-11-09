import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { paths } from "./paths";
import { RequireAuth, RequireRole } from "./guards";
import { RootRedirect } from "./RootRedirect";
import { LoadingFallback } from "./LoadingFallback";

// Lazy load pages for better code splitting
const LoginPage = lazy(() => import("@/pages/login"));
const HomePage = lazy(() => import("@/pages/home"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const SalesPage = lazy(() => import("@/pages/sales"));
const OrderConfirmationPage = lazy(() => import("@/pages/sales/OrderConfirmation"));
const CustomersPage = lazy(() => import("@/pages/customers"));
const InventoryPage = lazy(() => import("@/pages/inventory"));
const AdminPage = lazy(() => import("@/pages/admin"));
const NotFoundPage = lazy(() => import("@/pages/404"));

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Root route - redirects based on auth state */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public routes */}
        <Route path={paths.login()} element={<LoginPage />} />

        {/* Protected routes - require authentication (user or admin) */}
        <Route element={<RequireAuth />}>
          <Route path={paths.home()} element={<HomePage />} />
          <Route path={paths.dashboard()} element={<DashboardPage />} />
          <Route path={paths.sales.root()} element={<SalesPage />} />
          <Route path="/pos/sale/confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path={paths.customers.root()} element={<CustomersPage />} />
          <Route path={paths.inventory.root()} element={<InventoryPage />} />
          <Route path={paths.admin()} element={<AdminPage />} />
        </Route>

        {/* 404 and catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
