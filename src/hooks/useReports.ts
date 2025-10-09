import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { ReportService } from '@/services/reportService';
import { movementService } from '@/services/movementService';


export function useReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { products, getLowStockProducts } = useProducts();

  const generateLowStockReport = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Iniciando generación de reporte de stock bajo...');
      const lowStockProducts = await getLowStockProducts();
      
      if (lowStockProducts.length === 0) {
        setError('No hay productos con stock bajo para reportar');
        return;
      }
      
      const username = user?.username || 'Usuario';
      console.log(`Generando reporte para ${lowStockProducts.length} productos...`);
      
      if (format === 'pdf') {
        await ReportService.generateLowStockPDF(lowStockProducts, username);
        console.log('✅ Reporte PDF generado');
      } else {
        ReportService.generateLowStockExcel(lowStockProducts, username);
        console.log('✅ Reporte Excel generado');
      }
      
    } catch (err) {
      console.error('❌ Error generando reporte:', err);
      setError(err instanceof Error ? err.message : 'Error generando reporte');
    } finally {
      setLoading(false);
    }
  };

  const generateInventoryReport = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Iniciando generación de reporte de inventario...');
      if (products.length === 0) {
        setError('No hay productos para reportar');
        return;
      }
      
      const username = user?.username || 'Usuario';
      console.log(`Generando reporte para ${products.length} productos...`);
      
      if (format === 'pdf') {
        await ReportService.generateInventoryPDF(products, username);
        console.log('✅ Reporte PDF generado');
      } else {
        ReportService.generateInventoryExcel(products, username);
        console.log('✅ Reporte Excel generado');
      }
      
    } catch (err) {
      console.error('❌ Error generando reporte:', err);
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
      // Obtener movimientos reales del servicio
      const movements = await movementService.getAll({
        dateFrom,
        dateTo
      });
      
      if (movements.length === 0) {
        setError('No hay movimientos en el período seleccionado');
        return;
      }
      
      const username = user?.username || 'Usuario';
      
      if (format === 'pdf') {
        await ReportService.generateMovementsPDF(movements, dateFrom, dateTo, username);
      } else {
        ReportService.generateMovementsExcel(movements, dateFrom, dateTo, username);
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