export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatPercentage(value: number): string {
  return `${value}%`;
}

export function calculateDiscount(amount: number, percentage: number): number {
  return Math.round(amount * (percentage / 100));
}

export function calculateTotal(
  subtotal: number,
  deliveryFee: number = 0,
  discountPercent: number = 0
): number {
  const discount = calculateDiscount(subtotal + deliveryFee, discountPercent);
  return subtotal + deliveryFee - discount;
}

export const fmt = formatCurrency;