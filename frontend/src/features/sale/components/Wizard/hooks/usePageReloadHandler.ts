import { useEffect } from 'react';

interface ToastMethods {
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
}

export function usePageReloadHandler(clearDraft: () => void, toast: ToastMethods) {
  useEffect(() => {
    const handlePageReload = () => {
      sessionStorage.setItem('schedulerPageReloaded', 'true');
    };

    const wasReloaded = sessionStorage.getItem('schedulerPageReloaded');
    if (wasReloaded) {
      sessionStorage.removeItem('schedulerPageReloaded');
      clearDraft();
    }

    window.addEventListener('beforeunload', handlePageReload);
    
    return () => {
      window.removeEventListener('beforeunload', handlePageReload);
    };
  }, [clearDraft, toast]);
}
