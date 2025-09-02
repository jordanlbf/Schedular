import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Admin = lazy(() => import("./pages/Admin"));
const FrontDesk = lazy(() => import("../features/frontdesk/FrontDesk"));
const CreateSale = lazy(() => import("../features/sale/CreateSale"));
const CheckStock = lazy(() => import("../features/stock/CheckStock"));
const SearchCustomer = lazy(() => import("../features/customers/SearchCustomer"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div style={{padding:16}}>Loading…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pos" element={<FrontDesk />} />
        <Route path="/pos/sale" element={<CreateSale />} />
        <Route path="/pos/stock" element={<CheckStock />} />
        <Route path="/pos/customer" element={<SearchCustomer />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
