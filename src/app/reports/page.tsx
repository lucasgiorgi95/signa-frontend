'use client';

import { useState, useEffect } from 'react';
import { useReports } from '@/hooks/useReports';
import ProtectedRoute from '@/components/ProtectedRoute';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Product, StockMovement } from '@/types';
import { productService } from '@/services/productService';
import { movementService } from '@/services/movementService';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import HistoryIcon from '@mui/icons-material/History';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import GetAppIcon from '@mui/icons-material/GetApp';

type ReportType = 'inventory' | 'low-stock' | 'movements' | 'top-products';

interface ReportData {
  products?: Product[];
  movements?: StockMovement[];
  totalRecords?: number;
}

export default function ReportsPage() {
  const { 
    loading: reportLoading, 
    error, 
    generateLowStockReport, 
    generateInventoryReport, 
    generateMovementsReport,
    clearError 
  } = useReports();

  // Estados principales
  const [selectedReport, setSelectedReport] = useState<ReportType>('inventory');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtros
  const [dateFrom, setDateFrom] = useState(format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [movementType, setMovementType] = useState<string | 'all'>('all');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Opciones de reportes
  const reportOptions = [
    {
      id: 'inventory' as ReportType,
      name: 'Inventario Completo',
      description: 'Todos los productos con su stock actual',
      icon: InventoryIcon,
      color: 'green'
    },
    {
      id: 'low-stock' as ReportType,
      name: 'Stock Bajo',
      description: 'Productos que necesitan reposición',
      icon: WarningIcon,
      color: 'yellow'
    },
    {
      id: 'movements' as ReportType,
      name: 'Movimientos',
      description: 'Historial de entradas, salidas y ajustes',
      icon: HistoryIcon,
      color: 'purple'
    }
  ];

  // Cargar datos cuando cambia el tipo de reporte o filtros
  useEffect(() => {
    loadReportData();
  }, [selectedReport, dateFrom, dateTo, movementType]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      switch (selectedReport) {
        case 'inventory':
          const allProducts = await productService.getAll();
          setReportData({ products: allProducts, totalRecords: allProducts.length });
          break;
          
        case 'low-stock':
          const lowStockProducts = await productService.getLowStock();
          setReportData({ products: lowStockProducts, totalRecords: lowStockProducts.length });
          break;
          
        case 'movements':
          const movements = await movementService.getAll({
            dateFrom,
            dateTo,
            type: movementType === 'all' ? undefined : movementType
          });
          setReportData({ movements, totalRecords: movements.length });
          break;
      }
    } catch (error) {
      console.error('Error cargando datos del reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar datos por búsqueda
  const getFilteredData = () => {
    if (selectedReport === 'movements') {
      return reportData.movements?.filter(movement =>
        movement.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.product_id.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
    } else {
      return reportData.products?.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
    }
  };

  // Paginación
  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = async (format: 'pdf' | 'excel') => {
    clearError();
    
    switch (selectedReport) {
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

  const getStatusBadge = (product: Product) => {
    if (product.stock === 0) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Sin stock</span>;
    } else if (product.stock <= product.min_stock) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Stock bajo</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">En stock</span>;
    }
  };

  const getMovementTypeBadge = (type: string) => {
    const colors = {
      entrada: 'bg-green-100 text-green-800',
      salida: 'bg-red-100 text-red-800',
      ajuste: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type as keyof typeof colors]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header compacto */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AssessmentIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
              </div>
              
              {/* Selector de reporte compacto */}
              <div className="flex items-center space-x-2">
                <select
                  value={selectedReport}
                  onChange={(e) => {
                    setSelectedReport(e.target.value as ReportType);
                    setCurrentPage(1);
                    setSearchTerm('');
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {reportOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <WarningIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Filtros compactos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Búsqueda */}
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={selectedReport === 'movements' ? 'Buscar por razón o ID...' : 'Buscar por nombre o código...'}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Filtros específicos para movimientos */}
              {selectedReport === 'movements' && (
                <>
                  <div className="flex items-center space-x-2">
                    <CalendarTodayIcon className="h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <span className="text-gray-500 text-sm">a</span>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as string | 'all')}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="all">Todos</option>
                    <option value="entrada">Entradas</option>
                    <option value="salida">Salidas</option>
                    <option value="ajuste">Ajustes</option>
                  </select>
                </>
              )}

              {/* Botones de exportación */}
              <div className="flex space-x-2 ml-auto">
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={reportLoading || filteredData.length === 0}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PictureAsPdfIcon className="h-4 w-4 mr-1" />
                  PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  disabled={reportLoading || filteredData.length === 0}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TableViewIcon className="h-4 w-4 mr-1" />
                  Excel
                </button>
              </div>
            </div>
          </div>

          {/* Tabla principal */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 relative">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {reportOptions.find(r => r.id === selectedReport)?.name}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {loading ? 'Cargando...' : `${filteredData.length} registros`}
                  </span>
                </div>
                
                {/* Estadísticas compactas */}
                <div className="flex items-center space-x-4 text-sm">
                  {selectedReport !== 'movements' && (
                    <>
                      <div className="flex items-center">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full mr-1"></div>
                        <span className="text-gray-600">Stock bajo: {reportData.products?.filter(p => p.stock <= p.min_stock && p.stock > 0).length || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-2 w-2 bg-red-500 rounded-full mr-1"></div>
                        <span className="text-gray-600">Sin stock: {reportData.products?.filter(p => p.stock === 0).length || 0}</span>
                      </div>
                    </>
                  )}
                  {selectedReport === 'movements' && (
                    <>
                      <div className="flex items-center">
                        <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-gray-600">Entradas: {reportData.movements?.filter(m => m.type === 'entrada').length || 0}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-2 w-2 bg-red-500 rounded-full mr-1"></div>
                        <span className="text-gray-600">Salidas: {reportData.movements?.filter(m => m.type === 'salida').length || 0}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Aviso de sin datos */}
            {!loading && filteredData.length === 0 && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <WarningIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Sin datos</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tabla */}
            <div className="overflow-x-auto relative">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Cargando datos...</span>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {selectedReport === 'movements' ? (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Razón
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto ID
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Código
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock Actual
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock Mínimo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td 
                          colSpan={selectedReport === 'movements' ? 5 : 5} 
                          className="px-6 py-12 text-center text-gray-400"
                        >
                          <div className="flex flex-col items-center">
                            <SearchIcon className="h-8 w-8 mb-2" />
                            <span className="text-sm">No hay registros para mostrar</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {selectedReport === 'movements' ? (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {format(new Date((item as StockMovement).created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getMovementTypeBadge((item as StockMovement).type)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {(item as StockMovement).quantity}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                {(item as StockMovement).reason || 'Sin razón'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                {(item as StockMovement).product_id.substring(0, 8)}...
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {(item as Product).code}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                {(item as Product).name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {(item as Product).stock}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {(item as Product).min_stock}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(item as Product)}
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} registros
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <span className="px-3 py-2 text-sm text-gray-700">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loading State para exportación */}
          {reportLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-700 text-sm">Generando reporte...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}