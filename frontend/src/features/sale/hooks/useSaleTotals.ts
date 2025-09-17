import { useMemo } from 'react';
import type { LineItem, DeliveryDetails } from '@/shared/types';
import { CATALOG } from '../catalog';

export interface SaleTotals {
  itemsSum: number;    // Sum of RRP prices
  lineDiscount: number; // Difference between RRP and actual prices
  subtotal: number;    // itemsSum - lineDiscount (actual prices sum)
  deliveryFee: number;
  discount: number;    // Overall discount percentage applied
  total: number;
  deposit: number;
  remaining: number;
  serviceCharges?: number;
  tax?: number;
}

export function useSaleTotals(
  lines: LineItem[],
  deliveryDetails: DeliveryDetails,
  deliveryFee: number,
  discountPct: number
): SaleTotals {
  return useMemo(() => {
    // Calculate items sum (RRP) and line discount
    let itemsSum = 0;
    let actualSum = 0;
    
    lines.forEach(line => {
      // Find the product in catalog to get RRP
      const catalogProduct = CATALOG.find(p => p.sku === line.sku);
      const rrp = catalogProduct?.price || line.price; // Use catalog price as RRP, fallback to line price
      
      itemsSum += rrp * line.qty;
      actualSum += line.price * line.qty;
    });
    
    const lineDiscount = itemsSum - actualSum; // Total saved from RRP
    const subtotal = actualSum; // Actual prices after line-item discounts
    
    let calculatedDeliveryFee = deliveryFee;
    if (deliveryDetails.whiteGloveService) calculatedDeliveryFee += 15000;
    if (deliveryDetails.oldMattressRemoval) calculatedDeliveryFee += 5000;
    if (deliveryDetails.setupService) calculatedDeliveryFee += 7500;
    
    const beforeDiscount = subtotal + calculatedDeliveryFee;
    const discount = Math.round(beforeDiscount * (discountPct / 100));
    const total = beforeDiscount - discount;
    
    const deposit = Math.round(total * 0.3);
    const remaining = total - deposit;
    
    return {
      itemsSum,
      lineDiscount,
      subtotal,
      deliveryFee: calculatedDeliveryFee,
      discount,
      total,
      deposit,
      remaining,
    };
  }, [lines, deliveryDetails, deliveryFee, discountPct]);
}
