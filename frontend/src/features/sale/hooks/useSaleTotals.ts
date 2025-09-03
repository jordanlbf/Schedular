import { useMemo } from 'react';
import type { Line, DeliveryDetails } from '../types';

export interface SaleTotals {
  subtotal: number;
  serviceCharges: number;
  discount: number;
  deliveryFee: number;
  taxBase: number;
  tax: number;
  total: number;
}

/**
 * Custom hook for calculating sale totals
 */
export function useSaleTotals(
  lines: Line[],
  deliveryDetails: DeliveryDetails,
  deliveryFee: number,
  discountPct: number,
  taxRate: number = 0.10
): SaleTotals {
  return useMemo(() => {
    // Calculate subtotal from line items
    const subtotal = lines.reduce((sum, line) => sum + (line.qty * line.price), 0);

    // Calculate service charges
    let serviceCharges = 0;
    if (deliveryDetails.whiteGloveService) serviceCharges += 15000; // $150
    if (deliveryDetails.oldMattressRemoval) serviceCharges += 5000;  // $50
    if (deliveryDetails.setupService) serviceCharges += 7500;        // $75

    // Calculate discount
    const discount = Math.round(subtotal * (discountPct / 100));

    // Calculate tax base (subtotal + fees + services - discount)
    const taxBase = Math.max(0, subtotal - discount + deliveryFee + serviceCharges);

    // Calculate tax
    const tax = Math.round(taxBase * taxRate);

    // Calculate total
    const total = taxBase + tax;

    return {
      subtotal,
      serviceCharges,
      discount,
      deliveryFee,
      taxBase,
      tax,
      total,
    };
  }, [lines, deliveryDetails, deliveryFee, discountPct, taxRate]);
}
