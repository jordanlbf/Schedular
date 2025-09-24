// Cart API service
import { Cart, CartItem, CartTotals } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class CartAPI {
  private static getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async getCart(cartId?: string): Promise<Cart> {
    const url = cartId 
      ? `${API_BASE_URL}/cart/${cartId}`
      : `${API_BASE_URL}/cart/current`;
      
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    return response.json();
  }

  static async createCart(customerId?: string): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ customerId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create cart');
    }

    return response.json();
  }

  static async addItem(cartId: string, item: Omit<CartItem, 'id' | 'subtotal'>): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}/items`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }

    return response.json();
  }

  static async updateItem(cartId: string, itemId: string, updates: Partial<CartItem>): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}/items/${itemId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update cart item');
    }

    return response.json();
  }

  static async removeItem(cartId: string, itemId: string): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}/items/${itemId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to remove cart item');
    }

    return response.json();
  }

  static async clearCart(cartId: string): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}/clear`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }

    return response.json();
  }

  static async calculateTotals(cartId: string): Promise<CartTotals> {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}/totals`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to calculate cart totals');
    }

    return response.json();
  }

  static async applyDiscount(cartId: string, discountCode: string): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}/discount`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ code: discountCode }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to apply discount');
    }

    return response.json();
  }

  static async setCustomer(cartId: string, customerId: string): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}/customer`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ customerId }),
    });

    if (!response.ok) {
      throw new Error('Failed to set customer');
    }

    return response.json();
  }
}
