'use client';

import { useState } from 'react';
import { useReports } from '@/hooks/useReports';
import ProtectedRoute from '@/components/ProtectedRoute';
import { format } from 'date-fns';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import HistoryIcon from '@mui/icons-material/History';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function ReportsPage() {
  const { 
    loading, 
    error, 
    generateLowStockReport, 
    generateInventoryReport, 
    generateMovementsReport,
    clearError 
  } = useReports();
  
  const [dateFrom, setDateFrom] = useState(format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleGenerateReport = async (type: string, format: 'pdf' | 'excel') => {
    clearError();
    
    switch (type) {
      case 'low-stock':
        await generateLowStockReport(format);
        break;
      case 'inventory':
        await generateInventoryReport(format);
        break;
      case 'movements':
        await generateMovementsReport(dateFrom, dateTo, format);
        break;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <AssessmentIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
            </div>
            <p className="text-gray-600">
              Genera reportes detallados de tu inventario en PDF o Excel
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <WarningIcon className="h-5 w-5 mr-2" />
                {error}
              </div>
            </div>
          )}

          {/* Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Reporte de Stock Bajo */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <WarningIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Stock Bajo</h3>
                  <p className="text-sm text-gray-500">Productos que necesitan reposición</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Genera un reporte de todos los productos con stock igual o menor al stock mínimo configurado.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleGenerateReport('low-stock', 'pdf')}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  <PictureAsPdfIcon className="h-4 w-4 mr-2" />
                  PDF
                </button>
                <button
                  onClick={() => handleGenerateReport('low-stock', 'excel')}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <TableViewIcon className="h-4 w-4 mr-2" />
                  Excel
                </button>
              </div>
            </div>

            {/* Reporte de Inventario Completo */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <InventoryIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Inventario Completo</h3>
                  <p className="text-sm text-gray-500">Todos los productos y su stock actual</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Exporta el inventario completo con todos los productos, stock actual, stock mínimo y estado.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleGenerateReport('inventory', 'pdf')}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <PictureAsPdfIcon className="h-4 w-4 mr-2" />
                  PDF
                </button>
                <button
                  onClick={() => handleGenerateReport('inventory', 'excel')}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <TableViewIcon className="h-4 w-4 mr-2" />
                  Excel
                </button>
              </div>
            </div>

            {/* Reporte de Movimientos */}
            <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <HistoryIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Movimientos por Período</h3>
                  <p className="text-sm text-gray-500">Historial de entradas, salidas y ajustes</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Genera un reporte detallado de todos los movimientos de stock en un período específico.
              </p>
              
              {/* Selector de Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-2">
                    <CalendarTodayIcon className="h-4 w-4 inline mr-1" />
                    Fecha Desde
                  </label>
                  <input
                    type="date"
                    id="dateFrom"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-2">
                    <CalendarTodayIcon className="h-4 w-4 inline mr-1" />
                    Fecha Hasta
                  </label>
                  <input
                    type="date"
                    id="dateTo"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleGenerateReport('movements', 'pdf')}
                  disabled={loading || !dateFrom || !dateTo}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  <PictureAsPdfIcon className="h-4 w-4 mr-2" />
                  PDF
                </button>
                <button
                  onClick={() => handleGenerateReport('movements', 'excel')}
                  disabled={loading || !dateFrom || !dateTo}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <TableViewIcon className="h-4 w-4 mr-2" />
                  Excel
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-blue-700">Generando reporte...</span>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-3">💡 Información sobre Reportes</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Los reportes se descargan automáticamente en tu dispositivo</li>
              <li>• Los archivos PDF son ideales para imprimir o compartir</li>
              <li>• Los archivos Excel permiten análisis adicionales y filtros</li>
              <li>• Los reportes incluyen fecha de generación y usuario</li>
              <li>• Puedes generar reportes tantas veces como necesites</li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}