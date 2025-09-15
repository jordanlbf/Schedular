export function formatPrice(dollars: number): string {
  try {
    return dollars.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  } catch {
    return `$${Math.round(dollars)}`;
  }
}

export function formatSavings(dollars: number): string {
  try {
    const absAmount = Math.round(Math.abs(dollars) * 100) / 100;

    if (absAmount >= 10) {
      return Math.round(absAmount).toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    } else {
      return absAmount.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
  } catch {
    return `$${Math.round(Math.abs(dollars))}`;
  }
}

// Re-export existing functions for backwards compatibility
export { formatCurrency, fmt as formatCents } from './currency';