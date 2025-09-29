import { ReactNode } from 'react';
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
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to specified route or home
      navigate(fallbackTo);
    }
  };

  // Don't show back button on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <button
      onClick={handleBack}
      className="action-bar__back-btn"
      aria-label="Go back"
      type="button"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      Back
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
        {/* Left: Back button */}
        <div className="action-bar__left">
          {BackComponent}
        </div>

        {/* Center: Optional middle content */}
        <div className="action-bar__middle">
          {middle}
        </div>

        {/* Right: Primary action */}
        <div className="action-bar__right">
          {primaryAction}
        </div>
      </div>
    </div>
  );
}