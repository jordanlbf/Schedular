import { useNavigate, useLocation } from 'react-router-dom';
import './BackButton.css';

interface BackButtonProps {
  className?: string;
  fallbackTo?: string;
}

export default function BackButton({ className = '', fallbackTo = '/' }: BackButtonProps) {
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
      className={`back-btn ${className}`}
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