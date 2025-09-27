/**
 * Date utilities for sale wizard
 */

export function getMinDeliveryDate(daysFromNow: number = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

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