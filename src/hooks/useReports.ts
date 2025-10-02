import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useStock } from '@/hooks/useStock';
import { ReportService } from '@/services/reportService';
import { StockMovement } from '@/types';

export function useReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { products, getLowStockProducts } = useProducts();
  const { getMovementHistory } = useStock();

  const generateLowStockReport = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    setError(null);
    
    try {
      const lowStockProducts = await getLowStockProducts();
      
      if (lowStockProducts.length === 0) {
        setError('No hay productos con stock bajo para reportar');
        return;
      }
      
      const username = user?.username || 'Usuario';
      
      if (format === 'pdf') {
        ReportService.generateLowStockPDF(lowStockProducts, username);
      } else {
        ReportService.generateLowStockExcel(lowStockProducts, username);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generando reporte');
    } finally {
      setLoading(false);
    }
  };

  const generateInventoryReport = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    setError(null);
    
    try {
      if (products.length === 0) {
        setError('No hay productos para reportar');
        return;
      }
      
      const username = user?.username || 'Usuario';
      
      if (format === 'pdf') {
        ReportService.generateInventoryPDF(products, username);
      } else {
        ReportService.generateInventoryExcel(products, username);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generando reporte');
    } finally {
      setLoading(false);
    }
  };

  const generateMovementsReport = async (
    dateFrom: string, 
    dateTo: string, 
    format: 'pdf' | 'excel'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // En una implementación real, necesitarías un endpoint para obtener movimientos por fecha
      // Por ahora usamos datos mock
      const mockMovements: StockMovement[] = [
        {
          id: '1',
          product_id: 'prod-1',
          type: 'IN' as any,
          quantity: 50,
          reason: 'Compra inicial',
          user_id: user?.id || 'user-1',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          product_id: 'prod-1',
          type: 'OUT' as any,
          quantity: 5,
          reason: 'Venta',
          user_id: user?.id || 'user-1',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      if (mockMovements.length === 0) {
        setError('No hay movimientos en el período seleccionado');
        return;
      }
      
      const username = user?.username || 'Usuario';
      
      if (format === 'pdf') {
        ReportService.generateMovementsPDF(mockMovements, dateFrom, dateTo, username);
      } else {
        ReportService.generateMovementsExcel(mockMovements, dateFrom, dateTo, username);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generando reporte');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateLowStockReport,
    generateInventoryReport,
    generateMovementsReport,
    clearError: () => setError(null)
  };
}