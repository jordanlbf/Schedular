import { useEffect } from "react";
import Header from "@/app/layout/Header";
import { useSaleDraftStore } from "./stores/useSaleDraftStore";
import { useSaleWizard } from "./hooks/useSaleWizard";
import { usePageReloadHandler } from "./hooks/usePageReloadHandler";
import { ProgressBar } from "./components/wizard/shared/ProgressBar";
import { WizardSteps } from "./components/wizard/WizardSteps";
import { ToastContainer } from "@/shared/components/ToastContainer";
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

  const handleComplete = () => {
    if (wizard.validation.isValid) {
      toast.success("Order submitted for processing!");
      setTimeout(() => {
        clearDraft();
      }, 2000);
    }
  };

  // Add totals to navigation for payment step
  const navigationWithTotals = {
    ...wizard.navigation,
    totals: wizard.totals
  };

  return (
    <>
      <Header title="Create Sale" />
      <main className="wizard-container">
        <ProgressBar steps={wizard.progressSteps} />
        
        <WizardSteps
          currentStep={state.currentStep}
          state={state}
          updateField={updateField}
          navigation={navigationWithTotals}
          validation={wizard.validation}
          onComplete={handleComplete}
        />

        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </main>
    </>
  );
}
