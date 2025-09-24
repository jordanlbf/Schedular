import type { SaleOrder } from '@/shared/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export class SaleAPI {
  static async createOrder(order: Partial<SaleOrder>): Promise<SaleOrder> {
    const response = await fetch(`${API_BASE_URL}/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`);
    }

    return response.json();
  }

  static async getOrder(orderId: string): Promise<SaleOrder> {
    const response = await fetch(`${API_BASE_URL}/sales/${orderId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateOrder(orderId: string, updates: Partial<SaleOrder>): Promise<SaleOrder> {
    const response = await fetch(`${API_BASE_URL}/sales/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order: ${response.statusText}`);
    }

    return response.json();
  }

  static async cancelOrder(orderId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/sales/${orderId}/cancel`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel order: ${response.statusText}`);
    }
  }

  static async validateCustomer(customerId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}/validate`);
    return response.ok;
  }

  static async checkProductAvailability(sku: string, quantity: number): Promise<boolean> {
    const response = await fetch(
      `${API_BASE_URL}/products/${sku}/availability?quantity=${quantity}`
    );
    
    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.available;
  }

  static async calculateDeliveryFee(postcode: string, items: any[]): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/delivery/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postcode, items }),
    });

    if (!response.ok) {
      throw new Error(`Failed to calculate delivery fee: ${response.statusText}`);
    }

    const data = await response.json();
    return data.fee;
  }
}
