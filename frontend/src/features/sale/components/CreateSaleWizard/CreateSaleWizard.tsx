import { useEffect } from "react";
import Header from "@/app/layout/Header";
import { useSaleDraftStore, type WizardStep } from "../../stores/useSaleDraftStore";
import { useSaleWizard } from "./hooks/useSaleWizard";
import { usePageReloadHandler } from "./hooks/usePageReloadHandler";
import { useWizardCompletion } from "./hooks/useWizardCompletion";
import { ProgressBar } from "@/features/sale/components/CreateSaleWizard/components/ProgressBar";
import { WizardSteps } from "./WizardSteps";
import { ToastContainer } from "@/shared/ui/ToastContainer";
import { useToast, useBeforeUnload } from "@/shared/hooks";

export default function CreateSaleWizard() {
  const { state, updateField, hasUnsavedData, clearDraft } = useSaleDraftStore();
  const wizard = useSaleWizard(state, updateField);
  const toast = useToast();

  useBeforeUnload({
    when: hasUnsavedData(),
    message: 'You have unsaved sale data. Are you sure you want to leave?'
  });

  usePageReloadHandler(clearDraft, toast);

  const { handleComplete, handleAddSuccess } = useWizardCompletion({
    clearDraft,
    toast,
    isValid: wizard.validation.isValid
  });

  // Add totals to navigation for payment step
  const navigationWithTotals = {
    ...wizard.navigation,
    totals: wizard.totals
  };

  // Handle step navigation from progress bar clicks
  const handleStepClick = (stepId: string) => {
    wizard.navigation.goToStep(stepId as WizardStep);
  };

  return (
    <>
      <Header title="Create Sale" />
      <main className="wizard-container">
        <ProgressBar 
          steps={wizard.progressSteps} 
          onStepClick={handleStepClick}
        />
        
        <WizardSteps
          currentStep={state.currentStep}
          state={state}
          updateField={updateField}
          navigation={navigationWithTotals}
          validation={wizard.validation}
          onComplete={handleComplete}
          onAddSuccess={handleAddSuccess}
        />

        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </main>
    </>
  );
}
