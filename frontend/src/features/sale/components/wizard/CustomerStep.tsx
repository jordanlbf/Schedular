import type { Customer, Address } from '@/shared/types';
import { AUSTRALIAN_STATES } from '@/shared/constants';
import { WizardStepLayout } from './shared/WizardStepLayout';
import { ContactDetailsForm } from './forms/ContactDetailsForm';
import { AddressForm } from './forms/AddressForm';

interface CustomerStepProps {
  customer: Customer;
  setCustomer: (customer: Customer) => void;
  onNext: () => void;
  canProceed: boolean;
  errors?: string[];
}

export default function CustomerStep({ 
  customer, 
  setCustomer, 
  onNext, 
  canProceed,
  errors = []
}: CustomerStepProps) {
  
  const updateDeliveryAddress = (updates: Partial<Address>) => {
    const current = customer.deliveryAddress || { 
      street: "", 
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

  return (
    <WizardStepLayout
      title="Customer Information"
      onNext={onNext}
      canProceed={canProceed}
      nextLabel="Continue to Products"
      errors={errors}
      helpText="Please complete all required fields (marked with *)"
    >
      <div className="form-cards-grid">
        <ContactDetailsForm
          customer={customer}
          onChange={setCustomer}
        />
        
        <AddressForm
          address={customer.deliveryAddress}
          onChange={updateDeliveryAddress}
          states={AUSTRALIAN_STATES}
        />
      </div>
    </WizardStepLayout>
  );
}
