import { lazy } from "react";
import type { ComponentType } from "react";

export interface RouteConfig {
  path: string;
  component: ComponentType;
  name: string;
  isProtected?: boolean;
}

export const routeConfig: RouteConfig[] = [
  {
    path: "/",
    component: lazy(() => import("../../pages/home")),
    name: "Home"
  },
  {
    path: "/pos",
    component: lazy(() => import("../../features/frontdesk/components/FrontDesk")),
    name: "Front Desk"
  },
  {
    path: "/pos/sale",
    component: lazy(() => import("../../features/sale/CreateSaleWizard")),
    name: "Create Sale"
  },
  {
    path: "/pos/stock",
    component: lazy(() => import("../../features/stock/components/CheckStock")),
    name: "Check Stock"
  },
  {
    path: "/pos/customer",
    component: lazy(() => import("../../features/customers/components/SearchCustomer")),
    name: "Search Customer"
  },
  {
    path: "/admin",
    component: lazy(() => import("../../pages/admin")),
    name: "Admin"
  }
];
