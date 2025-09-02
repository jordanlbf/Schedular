export type RouteDoc = {
  path: string;
  name: string;
  component: string;          // docs-only;
  status?: "Planned" | "In progress" | "Ready";
};

export const ROUTE_DOCS: RouteDoc[] = [
  { path: "/",             name: "Home",            component: "src/app/pages/Home.tsx",                        status: "In progress" },
  { path: "/pos",          name: "Front Desk",      component: "src/features/frontdesk/FrontDesk.tsx",          status: "In progress" },
  { path: "/pos/sale",     name: "Create Sale",     component: "src/features/sale/CreateSaleWizard.tsx",        status: "Ready" },
  { path: "/pos/stock",    name: "Check Stock",     component: "src/features/stock/CheckStock.tsx",             status: "Planned" },
  { path: "/pos/customer", name: "Search Customer", component: "src/features/customers/SearchCustomer.tsx",     status: "Ready" },
  { path: "/admin",        name: "Admin",           component: "src/app/pages/Admin.tsx",                       status: "Planned" },
];