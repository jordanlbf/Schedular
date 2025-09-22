// Auth storage service for managing auth tokens and user data
import { User, AuthToken } from '../types';

export class AuthStorage {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_KEY = 'auth_user';

  static saveToken(token: AuthToken): void {
    localStorage.setItem(this.TOKEN_KEY, token.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token.refreshToken);
    
    // Calculate and store expiry time
    const expiryTime = Date.now() + token.expiresIn * 1000;
    localStorage.setItem(`${this.TOKEN_KEY}_expiry`, expiryTime.toString());
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static isTokenExpired(): boolean {
    const expiryTime = localStorage.getItem(`${this.TOKEN_KEY}_expiry`);
    if (!expiryTime) return true;
    
    return Date.now() > parseInt(expiryTime, 10);
  }

  static saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(`${this.TOKEN_KEY}_expiry`);
    localStorage.removeItem(this.USER_KEY);
  }

  static hasValidSession(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.isTokenExpired();
  }
}
