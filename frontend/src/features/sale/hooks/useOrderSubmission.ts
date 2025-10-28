import { useState } from 'react';
import { SaleAPI } from '@/features/sale/api';
import type { SaleOrder, Customer, Line, DeliveryDetails, PaymentMethod } from '@/features/sale/types';
import type { SaleTotals } from './useSaleTotals';

interface OrderSubmissionData {
  customer: Customer;
  lines: Line[];
  deliveryDetails: DeliveryDetails;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  discountPct: number;
  depositAmount: number;
  totals: SaleTotals;
}

interface UseOrderSubmissionResult {
  isSubmitting: boolean;
  error: string | null;
  submitOrder: (data: OrderSubmissionData) => Promise<SaleOrder | null>;
  clearError: () => void;
}

export function useOrderSubmission(): UseOrderSubmissionResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitOrder = async (data: OrderSubmissionData): Promise<SaleOrder | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Transform the wizard state into the API format
      const orderPayload: Partial<SaleOrder> = {
        customer: data.customer,
        items: data.lines.map(line => ({
          id: line.id,
          sku: line.sku,
          name: line.name,
          price: Number(line.price.toFixed(2)),
          qty: line.qty,
          color: line.color
        })),
        delivery: data.deliveryDetails,
        payment: {
          method: data.paymentMethod,
          discountPercent: data.discountPct,
          depositAmount: data.depositAmount
        },
        totals: {
          subtotal: data.totals.subtotal,
          deliveryFee: data.deliveryFee,
          discount: data.totals.discount,
          total: data.totals.total
        },
        status: 'pending' // New orders start as pending
      };

      const createdOrder = await SaleAPI.createOrder(orderPayload);
      
      setIsSubmitting(false);
      return createdOrder;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to submit order. Please try again.';
      
      setError(errorMessage);
      setIsSubmitting(false);
      return null;
    }
  };

  const clearError = () => setError(null);

  return {
    isSubmitting,
    error,
    submitOrder,
    clearError
  };
}
