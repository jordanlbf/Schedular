import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface UseNavigationBlockerProps {
  when: boolean;
  message: string;
  onBlock?: () => void;
  onUnblock?: () => void;
}

/**
 * Hook to block navigation when there are unsaved changes
 * Shows a confirmation dialog before allowing navigation
 */
export function useNavigationBlocker({
  when,
  message,
  onBlock,
  onUnblock
}: UseNavigationBlockerProps) {
  const location = useLocation();
  const isBlockingRef = useRef(false);

  useEffect(() => {
    if (!when) {
      isBlockingRef.current = false;
      return;
    }

    isBlockingRef.current = true;

    // Override the navigate function to show confirmation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    const handleNavigation = (originalMethod: typeof originalPushState) => {
      return function(this: History, data: unknown, unused: string, url?: string | URL | null) {
        if (isBlockingRef.current && url) {
          const targetPath = url.toString();
          const currentPath = location.pathname;

          // Only block if navigating to a different route
          if (targetPath !== currentPath) {
            const confirmed = window.confirm(message);

            if (confirmed) {
              isBlockingRef.current = false;
              onUnblock?.();
              originalMethod.call(this, data, unused, url);
            } else {
              onBlock?.();
              return;
            }
          }
        }
        originalMethod.call(this, data, unused, url);
      };
    };

    window.history.pushState = handleNavigation(originalPushState);
    window.history.replaceState = handleNavigation(originalReplaceState);

    // Handle browser back/forward buttons
    const handlePopState = (event: PopStateEvent) => {
      if (isBlockingRef.current) {
        const confirmed = window.confirm(message);
        if (!confirmed) {
          onBlock?.();
          // Push current state back to prevent navigation
          window.history.pushState(null, '', location.pathname);
          event.preventDefault();
          return;
        }
        onUnblock?.();
        isBlockingRef.current = false;
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handlePopState);
      isBlockingRef.current = false;
    };
  }, [when, message, location.pathname, onBlock, onUnblock]);

  // Function to manually unblock (for when user completes the form)
  const unblock = () => {
    isBlockingRef.current = false;
  };

  return { unblock };
}