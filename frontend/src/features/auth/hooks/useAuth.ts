// Auth hook for managing authentication state
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LoginCredentials, AuthState } from '../types';
import { AuthAPI } from '../services/auth.api';
import { AuthStorage } from '../services/auth.storage';

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (AuthStorage.hasValidSession()) {
          const user = await AuthAPI.getCurrentUser();
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const token = await AuthAPI.login(credentials);
      AuthStorage.saveToken(token);
      
      const user = await AuthAPI.getCurrentUser();
      AuthStorage.saveUser(user);

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      navigate('/dashboard');
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await AuthAPI.logout();
    } finally {
      AuthStorage.clearAuth();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      navigate('/login');
    }
  }, [navigate]);

  const refreshAuth = useCallback(async () => {
    const refreshToken = AuthStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const token = await AuthAPI.refreshToken(refreshToken);
      AuthStorage.saveToken(token);
      
      const user = await AuthAPI.getCurrentUser();
      AuthStorage.saveUser(user);

      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));
    } catch (error) {
      await logout();
      throw error;
    }
  }, [logout]);

  return {
    ...authState,
    login,
    logout,
    refreshAuth,
  };
};
