import type { SaleOrder, LineItem } from '@/shared/types';
import { apiClient } from '@/shared/api';

export class SaleAPI {
  static async createOrder(order: Partial<SaleOrder>): Promise<SaleOrder> {
    return apiClient.post<SaleOrder>('/sales', order);
  }

  static async getOrder(orderId: string): Promise<SaleOrder> {
    return apiClient.get<SaleOrder>(`/sales/${orderId}`);
  }

  static async updateOrder(orderId: string, updates: Partial<SaleOrder>): Promise<SaleOrder> {
    return apiClient.patch<SaleOrder>(`/sales/${orderId}`, updates);
  }

  static async cancelOrder(orderId: string): Promise<void> {
    return apiClient.post<void>(`/sales/${orderId}/cancel`);
  }

  static async validateCustomer(customerId: string): Promise<boolean> {
    try {
      await apiClient.get(`/customers/${customerId}/validate`);
      return true;
    } catch {
      return false;
    }
  }

  static async checkProductAvailability(sku: string, quantity: number): Promise<boolean> {
    try {
      const data = await apiClient.get<{ available: boolean }>(
        `/products/${sku}/availability`,
        { params: { quantity } }
      );
      return data.available;
    } catch {
      return false;
    }
  }

  static async calculateDeliveryFee(postcode: string, items: LineItem[]): Promise<number> {
    const data = await apiClient.post<{ fee: number }>('/delivery/calculate', {
      postcode,
      items
    });
    return data.fee;
  }
}
