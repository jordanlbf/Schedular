import type { Line } from '../types';
import { CATALOG } from '../catalog';

/**
 * Product management utilities
 */

export function addLineToCart(
  currentLines: Line[],
  sku: string | number,
  nextId: number,
  color?: string
): { lines: Line[]; nextId: number } {
  const item = CATALOG.find(x => x.sku === sku);
  if (!item) return { lines: currentLines, nextId };

  // Don't add discontinued items
  if (item.stock.status === 'discontinued') {
    return { lines: currentLines, nextId };
  }

  const existingIndex = currentLines.findIndex(l => 
    l.sku === String(item.sku) && l.color === color
  );
  
  if (existingIndex >= 0) {
    // Check stock availability before incrementing
    const newQty = currentLines[existingIndex].qty + 1;
    const stockLimit = item.stock.quantity;
    
    // For in-stock and low-stock items, respect stock limits
    if (item.stock.status !== 'out-of-stock' && stockLimit > 0 && newQty > stockLimit) {
      // Don't increment if it would exceed stock
      return { lines: currentLines, nextId };
    }
    
    // Increment existing item quantity
    const newLines = [...currentLines];
    newLines[existingIndex] = { 
      ...newLines[existingIndex], 
      qty: newQty
    };
    return { lines: newLines, nextId };
  } else {
    // For out-of-stock items, still allow adding (as pre-orders)
    // For in-stock items with 0 quantity, don't add
    if (item.stock.status !== 'out-of-stock' && item.stock.quantity === 0) {
      return { lines: currentLines, nextId };
    }
    
    // Add new item
    const newLine: Line = {
      id: nextId,
      sku: String(item.sku),
      name: item.name,
      qty: 1,
      price: item.price,
      color: color
    };
    return { 
      lines: [...currentLines, newLine], 
      nextId: nextId + 1 
    };
  }
}

export function updateLineQuantity(lines: Line[], id: number, delta: number): Line[] {
  return lines.map(line => {
    if (line.id !== id) return line;
    
    const newQty = line.qty + delta;
    
    // Don't allow quantity below 1
    if (newQty < 1) return line;
    
    // Check stock limits
    const item = CATALOG.find(x => x.sku === line.sku);
    if (item && item.stock.status !== 'out-of-stock' && item.stock.quantity > 0) {
      // Respect stock limits for in-stock and low-stock items
      const maxQty = item.stock.quantity;
      return { ...line, qty: Math.min(newQty, maxQty) };
    }
    
    return { ...line, qty: newQty };
  });
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
