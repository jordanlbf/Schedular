import { useEffect } from 'react';

const SESSION_KEYS = [
  'schedular.saleWizardDraft.v1',
  'schedular.sessionId'
];

const SESSION_STORAGE_KEY = 'schedulerSessionActive';
const MAX_SESSION_AGE = 4 * 60 * 60 * 1000; // 4 hours

/**
 * Hook to manage global session cleanup on app startup
 * Clears sale draft data when:
 * 1. Browser is closed and reopened (new session)
 * 2. Data is older than MAX_SESSION_AGE
 * 3. Page is refreshed after being inactive
 */
export function useSessionManager() {
  useEffect(() => {
    const initializeGlobalSession = () => {
      const currentTime = Date.now();
      
      // Check if this is a new browser session
      const isNewBrowserSession = !sessionStorage.getItem(SESSION_STORAGE_KEY);
      
      // Check session data age
      let sessionExpired = false;
      const sessionData = localStorage.getItem('schedular.sessionId');
      
      if (sessionData) {
        try {
          const { timestamp } = JSON.parse(sessionData);
          sessionExpired = (currentTime - timestamp) > MAX_SESSION_AGE;
        } catch {
          sessionExpired = true;
        }
      }
      
      // Clear data if new session or expired
      if (isNewBrowserSession || sessionExpired) {
        SESSION_KEYS.forEach(key => {
          localStorage.removeItem(key);
        });
        
      }
      
      // Mark this browser session as active
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      
      // Update session timestamp
      localStorage.setItem('schedular.sessionId', JSON.stringify({
        sessionId: Math.random().toString(36).substring(2) + Date.now().toString(36),
        timestamp: currentTime
      }));
    };
    
    initializeGlobalSession();
    
    // Also listen for beforeunload to update last activity
    const handleBeforeUnload = () => {
      const sessionData = localStorage.getItem('schedular.sessionId');
      if (sessionData) {
        try {
          const data = JSON.parse(sessionData);
          data.lastActivity = Date.now();
          localStorage.setItem('schedular.sessionId', JSON.stringify(data));
        } catch {
          // Ignore errors
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}
