import { useMemo } from 'react';
import type { LineItem, DeliveryDetails } from '@/shared/types';

export interface SaleTotals {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deposit: number;
  remaining: number;
}

export function useSaleTotals(
  lines: LineItem[],
  deliveryDetails: DeliveryDetails,
  deliveryFee: number,
  discountPct: number
): SaleTotals {
  return useMemo(() => {
    const subtotal = lines.reduce((sum, line) => sum + (line.price * line.qty), 0);
    
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
      subtotal,
      deliveryFee: calculatedDeliveryFee,
      discount,
      total,
      deposit,
      remaining,
    };
  }, [lines, deliveryDetails, deliveryFee, discountPct]);
}
