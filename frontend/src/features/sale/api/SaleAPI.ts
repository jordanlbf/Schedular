import type { SaleOrder } from '@/shared/types';
import { apiClient } from '@/shared/api';

export class SaleAPI {
  static async createOrder(order: Partial<SaleOrder>): Promise<SaleOrder> {
    return apiClient.post<SaleOrder>('/sales', order);
  }
}
