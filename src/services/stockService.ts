import apiClient from './axios';
import { StockAdjust, StockMovement, DashboardData } from '@/types';

export const stockService = {
  async adjust(adjustmentData: StockAdjust): Promise<StockMovement> {
    const response = await apiClient.post<StockMovement>('/stock/adjust/', adjustmentData);
    return response.data;
  },

  async getDashboard(): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>('/stock/dashboard/');
    return response.data;
  }
};