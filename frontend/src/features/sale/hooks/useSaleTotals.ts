import { useMemo } from 'react';
import type { LineItem, DeliveryDetails } from '@/shared/types';
import { useProductsContext } from '../contexts/ProductsContext';

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
  const { getProduct } = useProductsContext();

  return useMemo(() => {
    // Calculate items sum (RRP) and line discount
    let itemsSum = 0;
    let actualSum = 0;

    lines.forEach(line => {
      // Find the product to get RRP
      const product = getProduct(line.sku);
      const rrp = product?.price || line.price; // Use product price as RRP, fallback to line price

      itemsSum += rrp * line.qty;
      actualSum += line.price * line.qty;
    });
    
    const lineDiscount = itemsSum - actualSum; // Total saved from RRP
    const subtotal = actualSum; // Actual prices after line-item discounts (in dollars)

    let calculatedDeliveryFee = deliveryFee;
    if (deliveryDetails.whiteGloveService) calculatedDeliveryFee += 15000;
    if (deliveryDetails.oldMattressRemoval) calculatedDeliveryFee += 5000;
    if (deliveryDetails.setupService) calculatedDeliveryFee += 7500;

    // Convert subtotal to cents to match delivery fee format
    const beforeDiscount = (subtotal * 100) + calculatedDeliveryFee;
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
  }, [lines, deliveryDetails, deliveryFee, discountPct, getProduct]);
}
