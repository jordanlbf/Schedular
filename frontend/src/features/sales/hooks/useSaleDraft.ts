import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import type { Customer, Line, DeliveryDetails } from '../types';

export type WizardStep = 'customer' | 'products' | 'delivery' | 'payment';

export interface SaleDraft {
  customer: Customer;
  lines: Line[];
  nextId: number;
  deliveryDetails: DeliveryDetails;
  deliveryFee: number;
  discountPct: number;
  paymentMethod: string;
  depositAmount: number;
  currentStep: WizardStep;
  savedAt: number;
}

const DRAFT_KEY = "schedular.saleWizardDraft.v1";

const defaultCustomer: Customer = {
  name: "",
  phone: "",
  email: "",
  billingAddress: { street: "", city: "", state: "", zip: "", notes: "" },
  deliveryAddress: { street: "", city: "", state: "", zip: "" },
  sameAsDelivery: true
};

const defaultDeliveryDetails: DeliveryDetails = {
  preferredDate: "",
  timeSlot: "",
  specialInstructions: "",
  whiteGloveService: false,
  oldMattressRemoval: false,
  setupService: false
};

/**
 * Custom hook for managing sale wizard draft state with auto-save
 */
export function useSaleDraft() {
  const [draftData, setDraftData] = useLocalStorage<Partial<SaleDraft>>(DRAFT_KEY, {});
  
  const [currentStep, setCurrentStep] = useState<WizardStep>(
    draftData.currentStep || 'customer'
  );
  
  const [customer, setCustomer] = useState<Customer>(
    draftData.customer || defaultCustomer
  );
  
  const [lines, setLines] = useState<Line[]>(
    draftData.lines || []
  );
  
  const [nextId, setNextId] = useState<number>(
    draftData.nextId || 1
  );
  
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>(
    draftData.deliveryDetails || defaultDeliveryDetails
  );
  
  const [deliveryFee, setDeliveryFee] = useState<number>(
    draftData.deliveryFee || 0
  );
  
  const [discountPct, setDiscountPct] = useState<number>(
    draftData.discountPct || 0
  );
  
  const [paymentMethod, setPaymentMethod] = useState<string>(
    draftData.paymentMethod || ''
  );
  
  const [depositAmount, setDepositAmount] = useState<number>(
    draftData.depositAmount || 0
  );

  // Auto-save to localStorage when state changes
  useEffect(() => {
    const draft: SaleDraft = {
      customer,
      lines,
      nextId,
      deliveryDetails,
      deliveryFee,
      discountPct,
      paymentMethod,
      depositAmount,
      currentStep,
      savedAt: Date.now()
    };

    const timeoutId = setTimeout(() => {
      setDraftData(draft);
    }, 1000); // Debounce saves

    return () => clearTimeout(timeoutId);
  }, [customer, lines, nextId, deliveryDetails, deliveryFee, discountPct, paymentMethod, depositAmount, currentStep, setDraftData]);

  // Check if there's any unsaved data
  const hasUnsavedData = useCallback(() => {
    return (
      customer.name !== '' ||
      customer.phone !== '' ||
      customer.email !== '' ||
      lines.length > 0 ||
      deliveryDetails.preferredDate !== '' ||
      deliveryDetails.timeSlot !== '' ||
      deliveryDetails.specialInstructions !== '' ||
      deliveryFee > 0 ||
      discountPct > 0 ||
      paymentMethod !== '' ||
      depositAmount > 0 ||
      currentStep !== 'customer'
    );
  }, [customer, lines, deliveryDetails, deliveryFee, discountPct, paymentMethod, depositAmount, currentStep]);

  // Clear draft
  const clearDraft = useCallback(() => {
    setCustomer(defaultCustomer);
    setLines([]);
    setNextId(1);
    setDeliveryDetails(defaultDeliveryDetails);
    setDeliveryFee(0);
    setDiscountPct(0);
    setPaymentMethod('');
    setDepositAmount(0);
    setCurrentStep('customer');
    setDraftData({});
  }, [setDraftData]);

  return {
    // State
    currentStep,
    customer,
    lines,
    nextId,
    deliveryDetails,
    deliveryFee,
    discountPct,
    paymentMethod,
    depositAmount,
    
    // Setters
    setCurrentStep,
    setCustomer,
    setLines,
    setNextId,
    setDeliveryDetails,
    setDeliveryFee,
    setDiscountPct,
    setPaymentMethod,
    setDepositAmount,
    
    // Utils
    clearDraft,
    hasUnsavedData,
  };
}
