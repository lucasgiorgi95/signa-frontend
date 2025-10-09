import { useState } from 'react';
import { StockAdjust, StockMovement, DashboardData } from '@/types';
import { stockService } from '@/services/stockService';
import { movementService } from '@/services/movementService';

export function useStock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adjustStock = async (adjustmentData: StockAdjust): Promise<StockMovement | null> => {
    setLoading(true);
    setError(null);
    try {
      const movement = await stockService.adjust(adjustmentData);
      return movement;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error ajustando stock');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const quickAdjust = async (
    productId: number, 
    quantity: number, 
    reason?: string
  ): Promise<StockMovement | null> => {
    const type = quantity > 0 ? "entrada" : "salida";
    const adjustmentData: StockAdjust = {
      product_id: productId,
      quantity: Math.abs(quantity),
      type,
      reason: reason || `Ajuste rápido: ${quantity > 0 ? '+' : ''}${quantity}`
    };

    return adjustStock(adjustmentData);
  };

  const getDashboard = async (): Promise<DashboardData | null> => {
    setLoading(true);
    setError(null);
    try {
      const dashboard = await stockService.getDashboard();
      return dashboard;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando dashboard');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMovementHistory = async (productId: number): Promise<StockMovement[]> => {
    setLoading(true);
    setError(null);
    try {
      const movements = await movementService.getByProduct(productId);
      return movements;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando historial');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createMovement = async (movementData: any): Promise<StockMovement | null> => {
    setLoading(true);
    setError(null);
    try {
      const movement = await movementService.create(movementData);
      return movement;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando movimiento');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    adjustStock,
    quickAdjust,
    getDashboard,
    getMovementHistory,
    createMovement,
    clearError: () => setError(null)
  };
}