import apiClient from './axios';
import { StockAdjust, StockMovement, DashboardData } from '@/types';

interface StockResponse {
  success: boolean;
  data: StockMovement | DashboardData;
  message?: string;
}

export const stockService = {
  async adjust(adjustmentData: StockAdjust): Promise<StockMovement> {
    // Mapear los datos al formato del backend Node.js
    const payload = {
      productId: adjustmentData.product_id,
      quantity: adjustmentData.quantity,
      reason: adjustmentData.reason || 'Ajuste de stock'
    };
    
    const response = await apiClient.post<StockResponse>('/stock/adjust', payload);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error ajustando stock');
    }
    
    return response.data.data as StockMovement;
  },

  async getDashboard(): Promise<DashboardData> {
    const response = await apiClient.get<StockResponse>('/stock/dashboard');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error obteniendo datos del dashboard');
    }
    
    return response.data.data as DashboardData;
  }
};