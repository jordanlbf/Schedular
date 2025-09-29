import { Routes, Route } from "react-router-dom";
import { paths } from "./paths";

// Import pages with entity-based naming
import HomePage from "@/pages/home";
import DashboardPage from "@/pages/dashboard";
import SalesPage from "@/pages/sales";
import CustomersPage from "@/pages/customers";
import InventoryPage from "@/pages/inventory";
import AdminPage from "@/pages/admin";
import NotFoundPage from "@/pages/404";

export function AppRouter() {
  return (
    <Routes>
      <Route path={paths.home()} element={<HomePage />} />
      <Route path={paths.dashboard()} element={<DashboardPage />} />
      <Route path={paths.sales.root()} element={<SalesPage />} />
      <Route path={paths.customers.root()} element={<CustomersPage />} />
      <Route path={paths.inventory.root()} element={<InventoryPage />} />
      <Route path={paths.admin()} element={<AdminPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
