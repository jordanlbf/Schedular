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
  // Legacy alias for backward compatibility
  frontDesk: () => "/pos",

  // Sales module
  sales: {
    root: () => "/pos/sale",
    create: () => "/pos/sale",
  },
  // Legacy alias for backward compatibility
  sale: {
    root: () => "/pos/sale",
    create: () => "/pos/sale",
  },

  // Customer management
  customers: {
    search: () => "/pos/customer",
  },

  // Inventory management
  inventory: {
    checkStock: () => "/pos/stock",
  },

  // Utility
  notFound: () => "*",
} as const;