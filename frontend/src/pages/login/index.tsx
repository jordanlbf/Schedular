import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth';
import { paths } from '@/app/routing/paths';
import './login.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: 'admin' | 'user') => {
    login(role);

    // Both redirect to home, which shows appropriate workspace options
    navigate(paths.home());
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Schedular</h1>
          <p>Select your profile to continue</p>
        </div>

        <div className="login-profiles">
          <button
            type="button"
            className="profile-card profile-card--user"
            onClick={() => handleLogin('user')}
          >
            <div className="profile-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2>User</h2>
            <p>Access the front desk and sales system</p>
          </button>

          <button
            type="button"
            className="profile-card profile-card--admin"
            onClick={() => handleLogin('admin')}
          >
            <div className="profile-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15v6m0 0l-3-3m3 3l3-3M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                <path d="M9 22V12h6v10" />
              </svg>
            </div>
            <h2>Administrator</h2>
            <p>Manage system settings and inventory</p>
          </button>
        </div>

        <div className="login-footer">
          <p className="login-note">
            This is a profile selection screen. Authentication can be added later.
          </p>
        </div>
      </div>
    </div>
  );
}
