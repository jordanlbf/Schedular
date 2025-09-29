import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseNavigationPromptOptions {
  when: boolean;
  message?: string;
  onProceed?: () => void;
}

/**
 * Hook to show a confirmation dialog when the user tries to navigate away
 * @param when - Boolean indicating whether the warning should be active
 * @param message - Optional custom message for the warning
 * @param onProceed - Optional callback when user confirms navigation
 */
export function useNavigationPrompt({ when, message, onProceed }: UseNavigationPromptOptions) {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultMessage = 'You have unsaved changes. Are you sure you want to leave?';

  const handleNavigation = useCallback((targetPath: string) => {
    if (when) {
      const shouldProceed = window.confirm(message || defaultMessage);
      if (shouldProceed) {
        onProceed?.();
        navigate(targetPath);
      }
    } else {
      navigate(targetPath);
    }
  }, [when, message, defaultMessage, onProceed, navigate]);

  useEffect(() => {
    if (!when) return;

    // Override the navigate function to intercept navigation attempts
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    // Intercept programmatic navigation
    window.history.pushState = function(state, title, url) {
      if (url && url !== location.pathname) {
        const shouldProceed = window.confirm(message || defaultMessage);
        if (shouldProceed) {
          onProceed?.();
          originalPushState.apply(window.history, [state, title, url]);
        }
      } else {
        originalPushState.apply(window.history, [state, title, url]);
      }
    };

    window.history.replaceState = function(state, title, url) {
      if (url && url !== location.pathname) {
        const shouldProceed = window.confirm(message || defaultMessage);
        if (shouldProceed) {
          onProceed?.();
          originalReplaceState.apply(window.history, [state, title, url]);
        }
      } else {
        originalReplaceState.apply(window.history, [state, title, url]);
      }
    };

    // Handle back/forward browser navigation
    const handlePopState = (event: PopStateEvent) => {
      const shouldProceed = window.confirm(message || defaultMessage);
      if (!shouldProceed) {
        // Push current state back to prevent navigation
        window.history.pushState(null, '', location.pathname);
      } else {
        onProceed?.();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      // Restore original functions
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handlePopState);
    };
  }, [when, message, defaultMessage, onProceed, location.pathname]);

  return { handleNavigation };
}