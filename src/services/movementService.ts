import apiClient from './axios';
import { StockMovement, StockMovementCreate } from '@/types';

export const movementService = {
  async create(movementData: StockMovementCreate): Promise<StockMovement> {
    const response = await apiClient.post<StockMovement>('/movements/', movementData);
    return response.data;
  },

  async getByProduct(productId: string): Promise<StockMovement[]> {
    const response = await apiClient.get<StockMovement[]>(`/movements/${productId}`);
    return response.data;
  }
};