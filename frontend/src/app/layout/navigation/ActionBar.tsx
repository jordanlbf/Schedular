import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ActionBar.css';

interface ActionBarProps {
  /** Optional middle content slot */
  middle?: ReactNode;
  /** Primary action button (right side) */
  primaryAction?: ReactNode;
  /** Custom back button or null to hide */
  backButton?: ReactNode | null;
  /** Fallback route for back navigation */
  fallbackTo?: string;
  /** Custom className */
  className?: string;
}

function DefaultBackButton({ fallbackTo = '/' }: { fallbackTo?: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Navigate based on route hierarchy, not browser history
    const path = location.pathname;

    if (path === '/pos') {
      navigate('/');
    } else if (path.startsWith('/pos/')) {
      navigate('/pos');
    } else if (path === '/admin') {
      navigate('/');
    } else if (path.startsWith('/admin/')) {
      navigate('/admin');
    } else {
      // Use fallbackTo or default to home
      navigate(fallbackTo);
    }
  };

  // Don't show back button on home page
  if (location.pathname === '/') {
    return null;
  }

  // Determine appropriate label based on current route
  const getBackButtonLabel = () => {
    const path = location.pathname;

    if (path === '/pos') {
      return 'Return to Home';
    } else if (path.startsWith('/pos/')) {
      return 'Return to Dashboard';
    } else if (path === '/admin') {
      return 'Return to Home';
    } else if (path.startsWith('/admin/')) {
      return 'Return to Back Office';
    }

    return 'Back';
  };

  return (
    <button
      onClick={handleBack}
      className="action-bar__back-btn"
      aria-label={getBackButtonLabel()}
      type="button"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      {getBackButtonLabel()}
    </button>
  );
}

export default function ActionBar({
  middle,
  primaryAction,
  backButton,
  fallbackTo = '/',
  className = ''
}: ActionBarProps) {
  const location = useLocation();

  // Hide on home page unless explicitly shown
  if (location.pathname === '/' && !backButton && !primaryAction && !middle) {
    return null;
  }

  const BackComponent = backButton === null ? null : (backButton || <DefaultBackButton fallbackTo={fallbackTo} />);

  return (
    <div className={`action-bar ${className}`}>
      <div className="action-bar__container">
        {/* Only render slots that have content */}
        {BackComponent && (
          <div className="action-bar__left">
            {BackComponent}
          </div>
        )}

        {/* Center: Optional middle content */}
        {middle && (
          <div className="action-bar__middle">
            {middle}
          </div>
        )}

        {/* Right: Primary action */}
        {primaryAction && (
          <div className="action-bar__right">
            {primaryAction}
          </div>
        )}
      </div>
    </div>
  );
}