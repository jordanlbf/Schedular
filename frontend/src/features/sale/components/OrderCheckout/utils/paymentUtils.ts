/**
 * Payment and currency formatting utilities for checkout
 */

export function formatCurrency(cents: number, options: {
  currency?: string;
  locale?: string;
  showDecimals?: boolean;
} = {}): string {
  const { currency = "USD", locale, showDecimals = true } = options;

  try {
    return (cents / 100).toLocaleString(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    });
  } catch {
    return `$${showDecimals ? (cents / 100).toFixed(2) : Math.round(cents / 100)}`;
  }
}

// Legacy alias for backwards compatibility
export const fmt = formatCurrency;