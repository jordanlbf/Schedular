import { useMemo } from 'react';
import type { DeliveryDetails } from '@/features/sale/types';
import { SERVICE_OPTIONS } from '@/features/sale/components/CreateSaleWizard/constants/wizard';

export function useServiceCalculations(deliveryDetails: DeliveryDetails) {
  // Calculate total service charges
  const totalServiceCharges = useMemo(() => {
    let total = 0;
    if (deliveryDetails.whiteGloveService) total += SERVICE_OPTIONS.whiteGlove.price;
    if (deliveryDetails.oldMattressRemoval) total += SERVICE_OPTIONS.mattressRemoval.price;
    if (deliveryDetails.setupService) total += SERVICE_OPTIONS.setupService.price;
    return total;
  }, [deliveryDetails.whiteGloveService, deliveryDetails.oldMattressRemoval, deliveryDetails.setupService]);

  return {
    totalServiceCharges
  };
}