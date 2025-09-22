import { useEffect, useCallback } from 'react';

interface UseBeforeUnloadOptions {
  when: boolean;
  message?: string;
}

/**
 * Hook to show a confirmation dialog when the user tries to leave the page
 * @param when - Boolean indicating whether the warning should be active
 * @param message - Optional custom message for the warning
 */
export function useBeforeUnload({ when, message }: UseBeforeUnloadOptions) {
  const defaultMessage = 'You have unsaved changes. Are you sure you want to leave?';
  
  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (when) {
      event.preventDefault();
      // Modern browsers ignore the custom message and show their own
      // But still set it for compatibility
      event.returnValue = message || defaultMessage;
      return message || defaultMessage;
    }
  }, [when, message, defaultMessage]);

  useEffect(() => {
    if (when) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [when, handleBeforeUnload]);
}
