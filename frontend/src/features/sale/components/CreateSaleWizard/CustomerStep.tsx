import type { Customer, Address } from '@/shared/types';
import { AUSTRALIAN_STATES } from '@/shared/lib/constants';
import { WizardStepLayout } from '@/features/sale/components/CreateSaleWizard/ui/WizardStepLayout';
import { ContactDetailsForm } from '@/features/sale/components/CreateCustomer/forms/ContactDetailsForm';
import { AddressForm } from '@/features/sale/components/CreateCustomer/forms/AddressForm';
import { WIZARD_STEP_TITLES } from '@/features/sale/components/CreateSaleWizard/constants/wizard';

interface CustomerStepProps {
  customer: Customer;
  setCustomer: (customer: Customer) => void;
  onNext: () => void;
  canProceed: boolean;
  errors?: string[];
  fieldErrors?: { [key: string]: string };
}

export default function CustomerStep({ 
  customer, 
  setCustomer, 
  onNext, 
  canProceed,
  errors = [],
  fieldErrors = {}
}: CustomerStepProps) {
  
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

  return (
    <WizardStepLayout
      title={WIZARD_STEP_TITLES.customer}
      stepNumber="1"
      onNext={onNext}
      canProceed={canProceed}
      nextLabel="Continue to Products"
      errors={errors}
    >
      <div className="form-cards-grid">
        <ContactDetailsForm
          customer={customer}
          onChange={setCustomer}
          fieldErrors={fieldErrors}
        />
        
        <AddressForm
          address={customer.deliveryAddress}
          onChange={updateDeliveryAddress}
          states={AUSTRALIAN_STATES}
          fieldErrors={fieldErrors}
        />
      </div>
    </WizardStepLayout>
  );
}
