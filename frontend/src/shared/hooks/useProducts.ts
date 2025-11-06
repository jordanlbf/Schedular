/**
 * Re-export inventory hooks for convenience
 * This allows importing product hooks from @/shared/hooks
 */
export { 
  useProducts, 
  useProduct, 
  clearProductsCache 
} from '@/features/inventory/hooks';
