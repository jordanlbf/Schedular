/**
 * Currency formatting utilities
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

export function formatPrice(dollars: number, options: {
  currency?: string;
  locale?: string;
  showDecimals?: boolean;
} = {}): string {
  const { currency = "USD", locale, showDecimals = false } = options;

  try {
    return dollars.toLocaleString(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    });
  } catch {
    return `$${showDecimals ? dollars.toFixed(2) : Math.round(dollars)}`;
  }
}

export function formatSavings(dollars: number, options: {
  currency?: string;
  locale?: string;
} = {}): string {
  const { currency = "USD", locale } = options;
  const absAmount = Math.round(Math.abs(dollars) * 100) / 100;

  try {
    if (absAmount >= 10) {
      return Math.round(absAmount).toLocaleString(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    } else {
      return absAmount.toLocaleString(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
  } catch {
    return `$${Math.round(absAmount)}`;
  }
}