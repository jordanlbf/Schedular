/**
 * Color utility functions for handling product colors and color mapping
 */

/**
 * Helper function to get color value from catalog or fallback to hardcoded values
 * @param colorName - The name of the color to map
 * @param originalProduct - Optional product object with color definitions
 * @returns The hex color value
 */
export function getColorValue(colorName: string, originalProduct?: any): string {
  // First try to get the color from the actual product catalog
  if (originalProduct?.colors) {
    const catalogColor = originalProduct.colors.find((color: { name: string; value: string }) => color.name === colorName);
    if (catalogColor?.value) {
      return catalogColor.value;
    }
  }

  // Fallback to hardcoded mapping for colors not in catalog
  const colorMap: Record<string, string> = {
    'Red': '#ef4444',
    'Blue': '#3b82f6',
    'Green': '#10b981',
    'Yellow': '#f59e0b',
    'Purple': '#8b5cf6',
    'Pink': '#ec4899',
    'Orange': '#f97316',
    'Teal': '#14b8a6',
    'Indigo': '#6366f1',
    'Gray': '#6b7280',
    'Grey': '#6b7280',
    'Black': '#1f2937',
    'White': '#f9fafb',
    'Brown': '#8b4513',
    'Tan': '#CD853F',
    'Navy': '#1e3a8a',
    'Maroon': '#7f1d1d',
    'Silver': '#d1d5db',
    'Gold': '#fbbf24',
    'Natural Oak': '#C8956D',
    'Dark Walnut': '#4A2C17',
    'Arctic White': '#F8F8FF',
    'Dove Gray': '#696969'
  };

  return colorMap[colorName] || colorMap[colorName.charAt(0).toUpperCase() + colorName.slice(1)] || '#6b7280';
}

/**
 * Checks if a color name has a corresponding hex value
 * @param colorName - The name of the color to check
 * @returns True if the color exists in the mapping
 */
export function isValidColorName(colorName: string): boolean {
  return getColorValue(colorName) !== '#6b7280'; // Default gray means not found
}

/**
 * Gets a display-friendly color name
 * @param colorName - The color name to format
 * @returns A capitalized, display-friendly color name
 */
export function formatColorName(colorName: string): string {
  return colorName.charAt(0).toUpperCase() + colorName.slice(1).toLowerCase();
}