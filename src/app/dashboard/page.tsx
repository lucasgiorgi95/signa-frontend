'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStock } from '@/hooks/useStock';
import { useProducts } from '@/hooks/useProducts';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { DashboardData } from '@/types';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function Dashboard() {
  const { user } = useAuth();
  const { getDashboard, loading: stockLoading } = useStock();
  const { products, loading: productsLoading, getLowStockProducts } = useProducts();
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboard, lowStock] = await Promise.all([
        getDashboard(),
        getLowStockProducts()
      ]);
      
      if (dashboard) {
        setDashboardData(dashboard);
      }
      setLowStockProducts(lowStock);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Mostrar estado de carga
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Mostrar mensaje de error
  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md mx-4">
            <div className="text-red-500 mb-4">
              <ErrorIcon className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar el dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Dashboard de Inventario
              </h1>
              <p className="mt-3 text-lg text-gray-500">
                Bienvenido de vuelta! Aquí tienes un resumen de tu inventario
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={loadDashboardData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <RefreshIcon className="h-4 w-4 mr-2" />
                Actualizar
              </button>
            </div>
          </div>
      
          {/* Tarjetas KPI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total de Productos */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                  <InventoryIcon className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Productos</h3>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData?.total_products || 0}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Productos registrados</p>
              </div>
            </div>

            {/* Stock Bajo */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full -mr-10 -mt-10 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-md">
                  <WarningIcon className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Stock Bajo</h3>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData?.low_stock_count || 0}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Requieren reposición</p>
              </div>
            </div>

            {/* Sin Stock */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -mr-10 -mt-10 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md">
                  <ErrorIcon className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Sin Stock</h3>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData?.out_of_stock_count || 0}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Productos agotados</p>
              </div>
            </div>
          </div>

          {/* Anuncio PWA - Escáner Próximamente */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl border-2 border-indigo-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <QrCodeScannerIcon className="h-8 w-8 mr-3" />
                  <h2 className="text-2xl font-bold">📱 Escáner de Códigos - Próximamente</h2>
                </div>
                <p className="text-indigo-100 mb-2">
                  El escáner de códigos de barras con cámara estará disponible cuando convirtamos la app en PWA
                </p>
                <div className="flex items-center text-sm text-indigo-200">
                  <span className="mr-4">✨ Escáner en tiempo real</span>
                  <span className="mr-4">📱 App instalable</span>
                  <span>🔄 Funcionamiento offline</span>
                </div>
              </div>
              <div className="ml-6">
                <Link
                  href="/scanner"
                  className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <QrCodeScannerIcon className="h-5 w-5 mr-2" />
                  Búsqueda Manual
                </Link>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/products"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestionar Productos</h3>
                  <p className="text-gray-600">Ver, crear y editar productos</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md group-hover:scale-110 transition-transform">
                  <InventoryIcon className="h-6 w-6" />
                </div>
              </div>
            </Link>

            <Link
              href="/products/new"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nuevo Producto</h3>
                  <p className="text-gray-600">Agregar producto al inventario</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md group-hover:scale-110 transition-transform">
                  <AddIcon className="h-6 w-6" />
                </div>
              </div>
            </Link>

            <Link
              href="/reports"
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Generar Reportes</h3>
                  <p className="text-gray-600">Exportar datos en PDF/Excel</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md group-hover:scale-110 transition-transform">
                  <AssessmentIcon className="h-6 w-6" />
                </div>
              </div>
            </Link>
          </div>

          {/* Productos con Stock Bajo */}
          {lowStockProducts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                <div className="flex items-center">
                  <WarningIcon className="h-6 w-6 text-yellow-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Productos con Stock Bajo</h2>
                    <p className="text-sm text-gray-500 mt-1">Estos productos necesitan reposición</p>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
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
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">Código: {product.code}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.current_stock === 0 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.current_stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.min_stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/products/${product.id}/adjust`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ajustar Stock
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {lowStockProducts.length > 5 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-center">
                  <Link
                    href="/products?filter=low-stock"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver todos los productos con stock bajo ({lowStockProducts.length})
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}