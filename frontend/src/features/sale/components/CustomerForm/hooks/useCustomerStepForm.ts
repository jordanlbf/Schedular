import type { Customer, Address } from '@/shared/types';

interface UseCustomerStepFormProps {
  customer: Customer;
  setCustomer: (customer: Customer) => void;
}

export function useCustomerStepForm({ customer, setCustomer }: UseCustomerStepFormProps) {
  const updateDeliveryAddress = (updates: Partial<Address>) => {
    const current = customer.deliveryAddress || {
      unit: "",
      street: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      notes: ""
    };
    setCustomer({
      ...customer,
      deliveryAddress: { ...current, ...updates }
    });
  };

  return {
    updateDeliveryAddress,
  };
}