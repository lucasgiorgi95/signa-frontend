'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { StockMovement, MovementType, Product } from '@/types';
import { movementService } from '@/services/movementService';
import { productService } from '@/services/productService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import HistoryIcon from '@mui/icons-material/History';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GetAppIcon from '@mui/icons-material/GetApp';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function MovementsPage() {
  const { user } = useAuth();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState(format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [movementType, setMovementType] = useState<MovementType | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<number | 'all'>('all');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [movementsData, productsData] = await Promise.all([
        movementService.getAll({
          dateFrom,
          dateTo,
          type: movementType === 'all' ? undefined : movementType
        }),
        productService.getAll()
      ]);
      
      setMovements(movementsData);
      setProducts(productsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo, movementType]);

  // Filtrar movimientos
  const filteredMovements = movements.filter(movement => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (movement.reason?.toLowerCase().includes(searchLower) || false) ||
      (movement.product_id ? String(movement.product_id).toLowerCase().includes(searchLower) : false);
    const matchesProduct = selectedProduct === 'all' || movement.product_id === selectedProduct;
    
    return matchesSearch && matchesProduct;
  });

  // Paginación
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const paginatedMovements = filteredMovements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getProductName = (productId: number | null | undefined) => {
    if (!productId) return 'Producto no especificado';
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Producto no encontrado';
  };

  const getMovementTypeBadge = (type: string) => {
    const colors = {
      entrada: 'bg-green-100 text-green-800',
      salida: 'bg-red-100 text-red-800',
      ajuste: 'bg-blue-100 text-blue-800'
    };
    
    const icons = {
      entrada: '↗️',
      salida: '↘️', 
      ajuste: '🔄'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type as keyof typeof colors]}`}>
        {icons[type as keyof typeof icons]} {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const exportMovements = () => {
    const csvContent = [
      ['Fecha', 'Tipo', 'Producto', 'Cantidad', 'Razón', 'Usuario'].join(','),
      ...filteredMovements.map(movement => [
        format(new Date(movement.created_at), 'dd/MM/yyyy HH:mm'),
        movement.type,
        getProductName(movement.product_id),
        movement.quantity,
        movement.reason || '',
        movement.user_id ? String(movement.user_id) : 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `movimientos-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-4 px-4">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <HistoryIcon className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Movimientos de Stock</h1>
                  <p className="text-sm text-gray-500">Historial completo de entradas, salidas y ajustes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={loadData}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
                >
                  <RefreshIcon className="h-4 w-4 mr-1" />
                  Actualizar
                </button>
                <button
                  onClick={exportMovements}
                  className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center"
                >
                  <GetAppIcon className="h-4 w-4 mr-1" />
                  Exportar CSV
                </button>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center mb-4">
              <FilterListIcon className="h-5 w-5 text-gray-600 mr-2" />
              <h2 className="font-semibold text-gray-900">Filtros</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <div className="relative">
                  <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por razón o producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Fechas */}
              <div>
                <div className="relative">
                  <CalendarTodayIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tipo de movimiento */}
              <div>
                <select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value as MovementType | 'all')}
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="entrada">Entradas</option>
                  <option value="salida">Salidas</option>
                  <option value="ajuste">Ajustes</option>
                </select>
              </div>

              {/* Producto */}
              <div>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los productos</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <HistoryIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">{filteredMovements.length}</p>
                  <p className="text-xs text-gray-500">Total Movimientos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 font-bold">↗️</span>
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredMovements.filter(m => m.type === 'entrada').length}
                  </p>
                  <p className="text-xs text-gray-500">Entradas</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-red-600 font-bold">↘️</span>
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredMovements.filter(m => m.type === 'salida').length}
                  </p>
                  <p className="text-xs text-gray-500">Salidas</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 font-bold">🔄</span>
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredMovements.filter(m => m.type === 'ajuste').length}
                  </p>
                  <p className="text-xs text-gray-500">Ajustes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de movimientos */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                Historial de Movimientos ({filteredMovements.length} registros)
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              {error ? (
                <div className="p-8 text-center">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={loadData}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Reintentar
                  </button>
                </div>
              ) : paginatedMovements.length === 0 ? (
                <div className="p-8 text-center">
                  <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No se encontraron movimientos</p>
                  {movements.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      Aún no hay movimientos registrados. Los movimientos aparecerán cuando agregues, quites o ajustes stock de productos.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Intenta ajustar los filtros para ver más resultados.
                    </p>
                  )}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha y Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Razón
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedMovements.map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(movement.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getMovementTypeBadge(movement.type)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {getProductName(movement.product_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {movement.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {movement.reason || 'Sin razón especificada'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Usuario #{movement.user_id || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredMovements.length)} de {filteredMovements.length} registros
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
        </div>
      </div>
    </ProtectedRoute>
  );
}