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
    component: lazy(() => import("../../pages/front-desk")),
    name: "Front Desk"
  },
  {
    path: "/pos/sale",
    component: lazy(() => import("../../pages/create-sale")),
    name: "Create Sale"
  },
  {
    path: "/pos/stock",
    component: lazy(() => import("../../pages/check-stock")),
    name: "Check Stock"
  },
  {
    path: "/pos/customer",
    component: lazy(() => import("../../pages/search-customer")),
    name: "Search Customer"
  },
  {
    path: "/admin",
    component: lazy(() => import("../../pages/admin")),
    name: "Admin"
  },
];
