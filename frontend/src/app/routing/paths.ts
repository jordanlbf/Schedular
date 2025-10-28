/**
 * Typed path helpers for consistent routing throughout the application.
 * Uses entity-based naming for better scalability and maintainability.
 */
export const paths = {
  // Core pages
  home: () => "/",
  admin: () => "/admin",

  // Front desk dashboard
  dashboard: () => "/pos",

  // Sales module
  sales: {
    root: () => "/pos/sale",
    confirmation: (orderId: number) => `/pos/sale/confirmation/${orderId}`,
  },

  // Customer management
  customers: {
    root: () => "/pos/customer",
  },

  // Inventory management
  inventory: {
    root: () => "/pos/stock",
  },
} as const;

// Type helper for extracting path types
export type AppPaths = typeof paths;

// Helper for getting all possible route paths
export type RoutePath =
  | ReturnType<typeof paths.home>
  | ReturnType<typeof paths.dashboard>
  | ReturnType<typeof paths.sales.root>
  | ReturnType<typeof paths.customers.root>
  | ReturnType<typeof paths.inventory.root>
  | ReturnType<typeof paths.admin>;
