import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth';
import { Header, ActionBar } from '@/app/layout';
import './admin.css';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Header title="Admin Dashboard" />
      <main className="admin-page">
        <div className="admin-container">
          <div className="admin-welcome">
            <div className="admin-welcome__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15v6m0 0l-3-3m3 3l3-3M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                <path d="M9 22V12h6v10" />
              </svg>
            </div>
            <h1>Welcome, {user?.name}!</h1>
            <p>You are logged in as an administrator.</p>
          </div>

          <div className="admin-placeholder">
            <div className="placeholder-content">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <h2>Admin Features Coming Soon</h2>
              <p>
                This is a placeholder for the admin dashboard. Future features will include:
              </p>
              <ul>
                <li>System configuration and settings</li>
                <li>User management</li>
                <li>Inventory management</li>
                <li>Reports and analytics</li>
                <li>Database maintenance</li>
              </ul>
            </div>
          </div>

          <div className="admin-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleLogout}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </main>
      <ActionBar />
    </>
  );
}
