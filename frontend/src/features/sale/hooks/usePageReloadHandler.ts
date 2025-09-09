import { useEffect } from 'react';

export function usePageReloadHandler(clearDraft: () => void, toast: any) {
  useEffect(() => {
    const handlePageReload = () => {
      sessionStorage.setItem('schedulerPageReloaded', 'true');
    };

    const wasReloaded = sessionStorage.getItem('schedulerPageReloaded');
    if (wasReloaded) {
      sessionStorage.removeItem('schedulerPageReloaded');
      clearDraft();
      toast.info('Sale data cleared due to page refresh');
    }

    window.addEventListener('beforeunload', handlePageReload);
    
    return () => {
      window.removeEventListener('beforeunload', handlePageReload);
    };
  }, [clearDraft, toast]);
}
