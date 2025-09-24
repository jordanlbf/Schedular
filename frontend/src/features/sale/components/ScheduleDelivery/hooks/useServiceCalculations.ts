import { useMemo } from 'react';
import type { DeliveryDetails } from '../../../types';
import { SERVICE_OPTIONS } from '../../CreateSaleWizard/constants/wizard';

export function useServiceCalculations(deliveryDetails: DeliveryDetails) {
  // Calculate total service charges
  const totalServiceCharges = useMemo(() => {
    let total = 0;
    if (deliveryDetails.whiteGloveService) total += SERVICE_OPTIONS.whiteGlove.price;
    if (deliveryDetails.oldMattressRemoval) total += SERVICE_OPTIONS.mattressRemoval.price;
    if (deliveryDetails.setupService) total += SERVICE_OPTIONS.setupService.price;
    return total;
  }, [deliveryDetails.whiteGloveService, deliveryDetails.oldMattressRemoval, deliveryDetails.setupService]);

  // Calculate individual service costs
  const serviceCosts = useMemo(() => ({
    whiteGlove: deliveryDetails.whiteGloveService ? SERVICE_OPTIONS.whiteGlove.price : 0,
    mattressRemoval: deliveryDetails.oldMattressRemoval ? SERVICE_OPTIONS.mattressRemoval.price : 0,
    setupService: deliveryDetails.setupService ? SERVICE_OPTIONS.setupService.price : 0
  }), [deliveryDetails.whiteGloveService, deliveryDetails.oldMattressRemoval, deliveryDetails.setupService]);

  // Get selected services list
  const selectedServices = useMemo(() => {
    const services = [];
    if (deliveryDetails.whiteGloveService) {
      services.push({
        name: SERVICE_OPTIONS.whiteGlove.name,
        price: SERVICE_OPTIONS.whiteGlove.price,
        description: SERVICE_OPTIONS.whiteGlove.description
      });
    }
    if (deliveryDetails.oldMattressRemoval) {
      services.push({
        name: SERVICE_OPTIONS.mattressRemoval.name,
        price: SERVICE_OPTIONS.mattressRemoval.price,
        description: SERVICE_OPTIONS.mattressRemoval.description
      });
    }
    if (deliveryDetails.setupService) {
      services.push({
        name: SERVICE_OPTIONS.setupService.name,
        price: SERVICE_OPTIONS.setupService.price,
        description: SERVICE_OPTIONS.setupService.description
      });
    }
    return services;
  }, [deliveryDetails.whiteGloveService, deliveryDetails.oldMattressRemoval, deliveryDetails.setupService]);

  return {
    totalServiceCharges,
    serviceCosts,
    selectedServices
  };
}