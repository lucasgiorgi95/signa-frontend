import apiClient from './axios';
import { StockMovement, StockMovementCreate, MovementType } from '@/types';

interface MovementResponse {
  success: boolean;
  data: StockMovement | StockMovement[];
  message?: string;
  pagination?: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export const movementService = {
  async create(movementData: StockMovementCreate): Promise<StockMovement> {
    // Mapear los datos al formato del backend Node.js
    const payload = {
      productId: movementData.product_id,
      type: movementData.type === MovementType.IN ? 'entrada' : 'salida',
      quantity: movementData.quantity,
      reason: movementData.reason || 'Movimiento de stock'
    };
    
    const response = await apiClient.post<MovementResponse>('/movements', payload);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error creando movimiento');
    }
    
    return response.data.data as StockMovement;
  },

  async getByProduct(productId: string, params?: { page?: number; limit?: number }): Promise<StockMovement[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await apiClient.get<MovementResponse>(`/movements/${productId}?${queryParams.toString()}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error obteniendo movimientos');
    }
    
    return Array.isArray(response.data.data) ? response.data.data : [];
  }
};