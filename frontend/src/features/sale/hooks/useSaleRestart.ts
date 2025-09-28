import { useState, useCallback } from 'react';
import { useBeforeUnload, useToast } from '@/shared/hooks';

interface UseSaleRestartOptions {
  hasUnsavedData: boolean;
  onRestart: () => void;
}

/**
 * Hook to manage sale restart functionality with confirmation
 */
export function useSaleRestart({ hasUnsavedData, onRestart }: UseSaleRestartOptions) {
  const [showRestartModal, setShowRestartModal] = useState(false);
  const toast = useToast();

  // Enable beforeunload warning when there's unsaved data
  useBeforeUnload({
    when: hasUnsavedData,
    message: 'You have unsaved sale data. Are you sure you want to leave?'
  });

  const requestRestart = useCallback(() => {
    if (hasUnsavedData) {
      setShowRestartModal(true);
    } else {
      onRestart();
      toast.success('Sale process restarted');
    }
  }, [hasUnsavedData, onRestart, toast]);

  const confirmRestart = useCallback(() => {
    setShowRestartModal(false);
    onRestart();
    toast.success('Sale process restarted - all data cleared');
  }, [onRestart, toast]);

  const cancelRestart = useCallback(() => {
    setShowRestartModal(false);
  }, []);

  return {
    showRestartModal,
    requestRestart,
    confirmRestart,
    cancelRestart
  };
}
