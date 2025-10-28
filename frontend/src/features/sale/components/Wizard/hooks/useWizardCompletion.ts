import { useNavigate } from 'react-router-dom';
import { useOrderSubmission } from '@/features/sale/hooks';
import { paths } from '@/app/routing/paths';
import type { Customer, Line, DeliveryDetails } from '@/features/sale/types';
import type { SaleTotals } from '@/features/sale/hooks/useSaleTotals';

interface UseWizardCompletionProps {
  customer: Customer;
  lines: Line[];
  deliveryDetails: DeliveryDetails;
  deliveryFee: number;
  paymentMethod: string;
  discountPct: number;
  depositAmount: number;
  totals: SaleTotals;
  clearDraft: () => void;
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
  isValid: boolean;
}

export function useWizardCompletion({ 
  customer,
  lines,
  deliveryDetails,
  deliveryFee,
  paymentMethod,
  discountPct,
  depositAmount,
  totals,
  clearDraft, 
  toast, 
  isValid 
}: UseWizardCompletionProps) {
  const navigate = useNavigate();
  const { isSubmitting, error, submitOrder, clearError } = useOrderSubmission();

  const handleComplete = async () => {
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Submit the order to the backend
    const createdOrder = await submitOrder({
      customer,
      lines,
      deliveryDetails,
      deliveryFee,
      paymentMethod,
      discountPct,
      depositAmount,
      totals
    });

    if (createdOrder) {
      toast.success(`Order #${createdOrder.orderNumber} created successfully!`);
      
      // Clear the draft immediately
      clearDraft();
      
      // Navigate to confirmation page after a brief delay
      setTimeout(() => {
        navigate(paths.sales.confirmation(createdOrder.id!));
      }, 1000);
    } else if (error) {
      toast.error(error);
    }
  };

  const handleAddSuccess = (productName: string) => {
    toast.success(`${productName} added to cart!`);
  };

  return {
    handleComplete,
    handleAddSuccess,
    isSubmitting,
    error,
    clearError
  };
}
