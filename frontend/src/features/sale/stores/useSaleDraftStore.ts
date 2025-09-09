import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/shared/hooks';
import type { Customer, LineItem, DeliveryDetails } from '@/shared/types';

export type WizardStep = 'customer' | 'products' | 'delivery' | 'payment';

export interface SaleDraftState {
  customer: Customer;
  lines: LineItem[];
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

const initialCustomer: Customer = {
  name: "",
  phone: "",
  email: "",
  billingAddress: { street: "", city: "", state: "", zip: "", notes: "" },
  deliveryAddress: { street: "", city: "", state: "", zip: "" },
  sameAsDelivery: true
};

const initialDeliveryDetails: DeliveryDetails = {
  preferredDate: "",
  timeSlot: "",
  specialInstructions: "",
  whiteGloveService: false,
  oldMattressRemoval: false,
  setupService: false
};

export function useSaleDraftStore() {
  const [draftData, setDraftData] = useLocalStorage<Partial<SaleDraftState>>(DRAFT_KEY, {});
  
  const [state, setState] = useState<SaleDraftState>({
    customer: draftData.customer || initialCustomer,
    lines: draftData.lines || [],
    nextId: draftData.nextId || 1,
    deliveryDetails: draftData.deliveryDetails || initialDeliveryDetails,
    deliveryFee: draftData.deliveryFee || 0,
    discountPct: draftData.discountPct || 0,
    paymentMethod: draftData.paymentMethod || '',
    depositAmount: draftData.depositAmount || 0,
    currentStep: draftData.currentStep || 'customer',
    savedAt: draftData.savedAt || Date.now()
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDraftData(state);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [state, setDraftData]);

  const updateField = useCallback(<K extends keyof SaleDraftState>(
    field: K,
    value: SaleDraftState[K]
  ) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);

  const hasUnsavedData = useCallback(() => {
    return (
      state.customer.name !== '' ||
      state.customer.phone !== '' ||
      state.lines.length > 0 ||
      state.currentStep !== 'customer'
    );
  }, [state]);

  const clearDraft = useCallback(() => {
    setState({
      customer: initialCustomer,
      lines: [],
      nextId: 1,
      deliveryDetails: initialDeliveryDetails,
      deliveryFee: 0,
      discountPct: 0,
      paymentMethod: '',
      depositAmount: 0,
      currentStep: 'customer',
      savedAt: Date.now()
    });
    setDraftData({});
  }, [setDraftData]);

  return {
    state,
    updateField,
    hasUnsavedData,
    clearDraft,
  };
}

export type SaleDraftStore = ReturnType<typeof useSaleDraftStore>;
