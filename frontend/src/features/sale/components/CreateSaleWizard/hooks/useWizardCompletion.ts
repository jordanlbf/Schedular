interface UseWizardCompletionProps {
  clearDraft: () => void;
  toast: {
    success: (message: string) => void;
  };
  unblock: () => void;
  isValid: boolean;
}

export function useWizardCompletion({ clearDraft, toast, unblock, isValid }: UseWizardCompletionProps) {
  const handleComplete = () => {
    if (isValid) {
      toast.success("Order submitted for processing!");
      unblock(); // Unblock navigation immediately when sale is completed
      setTimeout(() => {
        clearDraft();
      }, 2000);
    }
  };

  const handleAddSuccess = (productName: string) => {
    toast.success(`${productName} added to cart!`);
  };

  return {
    handleComplete,
    handleAddSuccess,
  };
}