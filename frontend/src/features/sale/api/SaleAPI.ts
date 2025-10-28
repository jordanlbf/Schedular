import type { SaleOrder } from '@/shared/types';
import { apiClient } from '@/shared/api';

export class SaleAPI {
  static async createOrder(order: Partial<SaleOrder>): Promise<SaleOrder> {
    return apiClient.post<SaleOrder>('/sales', order);
  }

  static async getOrder(orderId: number): Promise<SaleOrder> {
    return apiClient.get<SaleOrder>(`/sales/${orderId}`);
  }

  static async updateOrder(orderId: number, updates: Partial<SaleOrder>): Promise<SaleOrder> {
    return apiClient.patch<SaleOrder>(`/sales/${orderId}`, updates);
  }

  static async cancelOrder(orderId: number): Promise<void> {
    return apiClient.post<void>(`/sales/${orderId}/cancel`);
  }
}
