'use client';

import { useState, useEffect } from 'react';
import { useStock } from '@/hooks/useStock';
import { useProducts } from '@/hooks/useProducts';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { StockMovement, Product, MovementType } from '@/types';
import HistoryIcon from '@mui/icons-material/History';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

export default function MovementsPage() {
  const { getMovementHistory, loading } = useStock();
  const { products } = useProducts();
  
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [filteredMovements, setFilteredMovements] = useState<StockMovement[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Mock data para demostración
  useEffect(() => {
    const mockMovements: StockMovement[] = [
      {
        id: '1',
        product_id: 'prod-1',
        type: MovementType.IN,
        quantity: 50,
        reason: 'Compra inicial',
        user_id: 'user-1',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        product_id: 'prod-1',
        type: MovementType.OUT,
        quantity: 5,
        reason: 'Venta',
        user_id: 'user-1',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        product_id: 'prod-2',
        type: MovementType.ADJUST,
        quantity: 25,
        reason: 'Inventario físico',
        user_id: 'user-1',
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ];
    
    setMovements(mockMovements);
    setFilteredMovements(mockMovements);
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...movements];

    if (selectedProduct) {
      filtered = filtered.filter(m => m.product_id === selectedProduct);
    }

    if (selectedType) {
      filtered = filtered.filter(m => m.type === selectedType);
    }

    if (dateFrom) {
      filtered = filtered.filter(m => new Date(m.created_at) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter(m => new Date(m.created_at) <= new Date(dateTo));
    }

    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMovements(filtered);
  }, [movements, selectedProduct, selectedType, dateFrom, dateTo, searchTerm]);

  const getMovementIcon = (type: MovementType) => {
    switch (type) {
      case MovementType.IN:
        return <TrendingUpIcon className="h-5 w-5 text-green-600" />;
      case MovementType.OUT:
        return <TrendingDownIcon className="h-5 w-5 text-red-600" />;
      case MovementType.ADJUST:
        return <SwapHorizIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <HistoryIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getMovementColor = (type: MovementType) => {
    switch (type) {
      case MovementType.IN:
        return 'bg-green-100 text-green-800';
      case MovementType.OUT:
        return 'bg-red-100 text-red-800';
      case MovementType.ADJUST:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Producto desconocido';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Historial de Movimientos</h1>
                <p className="mt-2 text-gray-600">Registro completo de todos los movimientos de stock</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {filteredMovements.length} movimientos
                </span>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center mb-4">
              <FilterListIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Búsqueda */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por razón..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Producto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los productos</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los tipos</option>
                  <option value={MovementType.IN}>Entrada</option>
                  <option value={MovementType.OUT}>Salida</option>
                  <option value={MovementType.ADJUST}>Ajuste</option>
                </select>
              </div>

              {/* Fecha desde */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Fecha hasta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Limpiar filtros */}
            {(selectedProduct || selectedType || dateFrom || dateTo || searchTerm) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedProduct('');
                    setSelectedType('');
                    setDateFrom('');
                    setDateTo('');
                    setSearchTerm('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>

          {/* Lista de Movimientos */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {filteredMovements.length === 0 ? (
              <div className="text-center py-12">
                <HistoryIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay movimientos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {movements.length === 0 
                    ? 'Aún no se han registrado movimientos de stock'
                    : 'No se encontraron movimientos con los filtros aplicados'
                  }
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredMovements.map((movement) => (
                  <li key={movement.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getMovementIcon(movement.type)}
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {getProductName(movement.product_id)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {movement.reason || 'Sin razón especificada'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementColor(movement.type)}`}>
                                  {movement.type === MovementType.IN && '+'}
                                  {movement.type === MovementType.OUT && '-'}
                                  {movement.quantity}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-900">
                                  {formatDate(movement.created_at)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {movement.type === MovementType.IN ? 'Entrada' : 
                                   movement.type === MovementType.OUT ? 'Salida' : 'Ajuste'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Estadísticas */}
          {filteredMovements.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {filteredMovements.filter(m => m.type === MovementType.IN).length}
                  </p>
                  <p className="text-sm text-gray-500">Entradas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {filteredMovements.filter(m => m.type === MovementType.OUT).length}
                  </p>
                  <p className="text-sm text-gray-500">Salidas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredMovements.filter(m => m.type === MovementType.ADJUST).length}
                  </p>
                  <p className="text-sm text-gray-500">Ajustes</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}