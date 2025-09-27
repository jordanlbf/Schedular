/**
 * Date utilities for sale wizard
 */

export function getEstimatedDeliveryDate(daysFromNow: number = 14): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}