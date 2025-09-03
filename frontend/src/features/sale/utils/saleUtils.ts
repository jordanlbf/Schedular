import type { Line } from '../types';
import { CATALOG } from '../catalog';

/**
 * Product management utilities
 */

export function addLineToCart(
  currentLines: Line[],
  sku: string | number,
  nextId: number
): { lines: Line[]; nextId: number } {
  const item = CATALOG.find(x => x.sku === sku);
  if (!item) return { lines: currentLines, nextId };

  const existingIndex = currentLines.findIndex(l => l.sku === String(item.sku));
  
  if (existingIndex >= 0) {
    // Increment existing item quantity
    const newLines = [...currentLines];
    newLines[existingIndex] = { 
      ...newLines[existingIndex], 
      qty: newLines[existingIndex].qty + 1 
    };
    return { lines: newLines, nextId };
  } else {
    // Add new item
    const newLine: Line = {
      id: nextId,
      sku: String(item.sku),
      name: item.name,
      qty: 1,
      price: item.price
    };
    return { 
      lines: [...currentLines, newLine], 
      nextId: nextId + 1 
    };
  }
}

export function updateLineQuantity(lines: Line[], id: number, delta: number): Line[] {
  return lines.map(line => 
    line.id === id 
      ? { ...line, qty: Math.max(1, line.qty + delta) }
      : line
  );
}

export function removeLine(lines: Line[], id: number): Line[] {
  return lines.filter(line => line.id !== id);
}

/**
 * Date utilities
 */

export function getMinDeliveryDate(daysFromNow: number = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

export function getEstimatedDeliveryDate(daysFromNow: number = 14): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString();
}

/**
 * Validation utilities
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Basic Australian phone validation
  const phoneRegex = /^(\+?61|0)[2-478](?:[0-9]){8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function isValidPostcode(postcode: string): boolean {
  // Australian postcode validation
  const postcodeRegex = /^[0-9]{4}$/;
  return postcodeRegex.test(postcode);
}
