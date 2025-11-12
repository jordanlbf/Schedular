/**
 * Category icon mappings for inventory display
 */
export const CATEGORY_ICONS: Record<string, string> = {
  'Mattresses': '🛏️',
  'Sofas': '🛋️',
  'Beds': '🛏️',
  'Tables': '🍽️',
  'Chairs': '🪑',
  'Storage': '🗄️',
  'Lighting': '💡',
  'Decor': '🖼️',
};

/**
 * Get icon for a category with fallback
 */
export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] || '📦';
}
