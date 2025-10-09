'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useStock } from '@/hooks/useStock';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { StockMovement, Product } from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function ProductMovementsPage() {
  const params = useParams();
  const { getMovementHistory, loading } = useStock();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Mock product data
        const mockProduct: Product = {
          id: parseInt(params.productId as string) || 1,
          code: '123456789',
          name: 'Producto de Ejemplo',
          stock: 45,
          min_stock: 10,
          price: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Mock movements data
        const mockMovements: StockMovement[] = [
          {
            id: 1,
            product_id: parseInt(params.productId as string) || 1,
            type: "entrada",
            quantity: 50,
            reason: 'Compra inicial de inventario',
            user_id: 'user-uuid-1',
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            product_id: parseInt(params.productId as string) || 1,
            type: "salida",
            quantity: 3,
            reason: 'Venta a cliente',
            user_id: 'user-uuid-1',
            created_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 3,
            product_id: parseInt(params.productId as string) || 1,
            type: "salida",
            quantity: 2,
            reason: 'Venta a cliente',
            user_id: 'user-uuid-1',
            created_at: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: 4,
            product_id: parseInt(params.productId as string) || 1,
            type: "ajuste",
            quantity: 45,
            reason: 'Ajuste por inventario físico',
            user_id: 'user-uuid-1',
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ];

        setProduct(mockProduct);
        setMovements(mockMovements);
        
        // En una implementación real:
        // const productMovements = await getMovementHistory(params.productId as string);
        // setMovements(productMovements);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando datos');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.productId) {
      loadData();
    }
  }, [params.productId]);

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "entrada":
        return <TrendingUpIcon className="h-5 w-5 text-green-600" />;
      case "salida":
        return <TrendingDownIcon className="h-5 w-5 text-red-600" />;
      case "ajuste":
        return <SwapHorizIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <HistoryIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case "entrada":
        return 'bg-green-100 text-green-800';
      case "salida":
        return 'bg-red-100 text-red-800';
      case "ajuste":
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

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case "entrada":
        return 'Entrada';
      case "salida":
        return 'Salida';
      case "ajuste":
        return 'Ajuste';
      default:
        return 'Desconocido';
    }
  };

  // Calcular estadísticas
  const totalEntries = movements.filter(m => m.type === "entrada").reduce((sum, m) => sum + m.quantity, 0);
  const totalExits = movements.filter(m => m.type === "salida").reduce((sum, m) => sum + m.quantity, 0);
  const totalAdjustments = movements.filter(m => m.type === "ajuste").length;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando historial...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !product) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'Producto no encontrado'}</p>
            <Link
              href="/products"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Volver a Productos
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowBackIcon className="h-4 w-4 mr-1" />
              Volver a productos
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Historial de Movimientos</h1>
            <p className="mt-2 text-gray-600">Registro completo de movimientos para este producto</p>
          </div>

          {/* Info del Producto */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <InventoryIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                  <p className="text-sm text-gray-500">Código: {product.code}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-sm text-gray-700">
                      Stock actual: <span className="font-semibold text-lg">{product.stock}</span>
                    </span>
                    <span className="text-sm text-gray-700">
                      Stock mínimo: <span className="font-medium">{product.min_stock}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={`/products/${product.id}/adjust`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Ajustar Stock
                </Link>
                <Link
                  href={`/products/${product.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Editar Producto
                </Link>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <HistoryIcon className="h-8 w-8 text-gray-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Movimientos</p>
                  <p className="text-2xl font-semibold text-gray-900">{movements.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUpIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Entradas</p>
                  <p className="text-2xl font-semibold text-green-600">+{totalEntries}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingDownIcon className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Salidas</p>
                  <p className="text-2xl font-semibold text-red-600">-{totalExits}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <SwapHorizIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Ajustes</p>
                  <p className="text-2xl font-semibold text-blue-600">{totalAdjustments}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Movimientos */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Historial de Movimientos ({movements.length})
              </h3>
            </div>
            
            {movements.length === 0 ? (
              <div className="text-center py-12">
                <HistoryIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay movimientos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Este producto aún no tiene movimientos registrados
                </p>
                <div className="mt-6">
                  <Link
                    href={`/products/${product.id}/adjust`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Realizar Primer Movimiento
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {movements.map((movement, index) => (
                  <li key={movement.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getMovementIcon(movement.type)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {movement.reason || 'Sin razón especificada'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {getMovementTypeLabel(movement.type)} • {formatDate(movement.created_at)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getMovementColor(movement.type)}`}>
                                {movement.type === "entrada" && '+'}
                                {movement.type === "salida" && '-'}
                                {movement.quantity}
                              </span>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  #{movements.length - index}
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

          {/* Acciones */}
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">¿Necesitas hacer un ajuste de stock?</span>
              <div className="flex space-x-3">
                <Link
                  href="/movements"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Ver Todos los Movimientos
                </Link>
                <Link
                  href={`/products/${product.id}/adjust`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ajustar Stock →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}