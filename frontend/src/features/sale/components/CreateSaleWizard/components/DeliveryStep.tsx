import type { DeliveryDetails } from '@/features/sale/types';
import { WizardStepLayout } from '@/features/sale/components/CreateSaleWizard/components/WizardStepLayout';
import { WIZARD_STEP_TITLES } from '../constants/wizard';
import ScheduleDelivery from '@/features/sale/components/ScheduleDelivery/components/ScheduleDelivery';
import { useScheduleDeliveryForm } from '@/features/sale/components/ScheduleDelivery/hooks/useScheduleDeliveryForm';

interface DeliveryStepProps {
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  deliveryFee: number;
  setDeliveryFee: (fee: number) => void;
  estimatedDelivery: string;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  errors?: string[];
}

export default function DeliveryStep({
  deliveryDetails,
  setDeliveryDetails,
  deliveryFee,
  setDeliveryFee,
  estimatedDelivery,
  onNext,
  onPrev,
  canProceed,
  errors = []
}: DeliveryStepProps) {
  const { isFormValid, handleValidationChange } = useScheduleDeliveryForm();

  // Handle next button click with validation
  const handleNext = () => {
    if (isFormValid) {
      onNext();
    }
  };

  // Determine if we can actually proceed
  const canActuallyProceed = canProceed && isFormValid;

  return (
    <WizardStepLayout
      title={WIZARD_STEP_TITLES.delivery}
      stepNumber="3"
      onNext={handleNext}
      onPrev={onPrev}
      canProceed={canActuallyProceed}
      nextLabel="Continue to Payment"
      errors={errors}
    >
      <ScheduleDelivery
        deliveryDetails={deliveryDetails}
        setDeliveryDetails={setDeliveryDetails}
        deliveryFee={deliveryFee}
        setDeliveryFee={setDeliveryFee}
        estimatedDelivery={estimatedDelivery}
        canProceed={canActuallyProceed}
        errors={errors}
        onValidationChange={handleValidationChange}
      />
    </WizardStepLayout>
  );
}