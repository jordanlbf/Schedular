// Auth service API calls
import { LoginCredentials, AuthToken, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class AuthAPI {
  private static getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  static async login(credentials: LoginCredentials): Promise<AuthToken> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: AuthAPI.getHeaders(false),
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const token = await response.json();
    localStorage.setItem('auth_token', token.accessToken);
    return token;
  }

  static async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: AuthAPI.getHeaders(),
      });
    } finally {
      localStorage.removeItem('auth_token');
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthToken> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: AuthAPI.getHeaders(false),
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const token = await response.json();
    localStorage.setItem('auth_token', token.accessToken);
    return token;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: AuthAPI.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }

  static async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: AuthAPI.getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password update failed');
    }
  }
}
