import type { Customer } from '@/shared/types';
import { AUSTRALIAN_STATES } from '../CreateCustomer/utils/customerUtils';
import { WizardStepLayout } from '@/features/sale/components/CreateSaleWizard/components/WizardStepLayout';
import { ContactDetailsForm } from '@/features/sale/components/CreateCustomer/components/ContactDetailsForm';
import { AddressForm } from '@/features/sale/components/CreateCustomer/components/AddressForm';
import { WIZARD_STEP_TITLES } from '@/features/sale/components/CreateSaleWizard/constants/wizard';
import { useCustomerStepForm } from '../CreateCustomer/hooks/useCustomerStepForm';

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
  const { updateDeliveryAddress } = useCustomerStepForm({ customer, setCustomer });

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
