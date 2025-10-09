'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStock } from '@/hooks/useStock';
import { useProducts } from '@/hooks/useProducts';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { DashboardData, Product, StockMovement } from '@/types';
import { productService } from '@/services/productService';
import { movementService } from '@/services/movementService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AddIcon from '@mui/icons-material/Add';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SearchIcon from '@mui/icons-material/Search';

import NotificationsIcon from '@mui/icons-material/Notifications';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import HistoryIcon from '@mui/icons-material/History';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SpeedIcon from '@mui/icons-material/Speed';

export default function Dashboard() {
  const { user } = useAuth();
  const { getDashboard } = useStock();
  const { products } = useProducts();
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentMovements, setRecentMovements] = useState<StockMovement[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allProducts, movements] = await Promise.all([
        productService.getAll(),
        movementService.getAll({ limit: 5 })
      ]);
      
      // Calcular métricas
      const totalProducts = allProducts.length;
      const lowStock = allProducts.filter(p => p.stock <= p.min_stock && p.stock > 0);
      const outOfStock = allProducts.filter(p => p.stock === 0);
      
      setDashboardData({
        total_products: totalProducts,
        low_stock_count: lowStock.length,
        out_of_stock_count: outOfStock.length
      });
      
      setLowStockProducts(lowStock.slice(0, 3));
      setRecentMovements(movements.slice(0, 3));
      
      // Top productos (simulado)
      setTopProducts([
        { name: 'Producto A', movements: 45, trend: 'up' },
        { name: 'Producto B', movements: 32, trend: 'down' },
        { name: 'Producto C', movements: 28, trend: 'up' }
      ]);

      // Generar notificaciones reales
      const alerts = [];
      
      // Alertas de stock bajo
      if (lowStock.length > 0) {
        alerts.push({
          id: 1,
          type: 'warning',
          title: 'Stock Bajo',
          message: `${lowStock.length} producto${lowStock.length > 1 ? 's' : ''} necesita${lowStock.length > 1 ? 'n' : ''} reposición`,
          time: new Date(),
          icon: '⚠️'
        });
      }
      
      // Alertas de sin stock
      if (outOfStock.length > 0) {
        alerts.push({
          id: 2,
          type: 'error',
          title: 'Sin Stock',
          message: `${outOfStock.length} producto${outOfStock.length > 1 ? 's' : ''} agotado${outOfStock.length > 1 ? 's' : ''}`,
          time: new Date(),
          icon: '🚨'
        });
      }
      
      // Alerta de movimientos recientes
      if (movements.length > 0) {
        alerts.push({
          id: 3,
          type: 'info',
          title: 'Actividad Reciente',
          message: `${movements.length} movimiento${movements.length > 1 ? 's' : ''} en las últimas horas`,
          time: new Date(),
          icon: '📊'
        });
      }
      
      setNotifications(alerts);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // Auto-refresh cada 5 minutos
    const interval = setInterval(loadDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar notificaciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showNotifications]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <ErrorIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-gray-600 mb-3">{error}</p>
            <button
              onClick={loadDashboardData}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
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
      <div className="min-h-screen bg-gray-50 py-4 px-4">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Header compacto con herramientas */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Hola {user?.username} 👋
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Búsqueda rápida */}
                <div className="relative">
                  <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-3 py-2 text-sm border rounded-md w-48 bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Notificaciones */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-md hover:bg-gray-100"
                  >
                    <NotificationsIcon className="h-5 w-5 text-gray-600" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  
                  {/* Dropdown de notificaciones */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <NotificationsIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No hay notificaciones</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                              <div className="flex items-start">
                                <span className="text-lg mr-3">{notification.icon}</span>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {notification.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {format(notification.time, 'HH:mm', { locale: es })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200">
                          <button 
                            onClick={() => setNotifications([])}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Marcar todas como leídas
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* KPIs compactos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <InventoryIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.total_products || 0}
                  </p>
                  <p className="text-xs text-gray-500">Productos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <WarningIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.low_stock_count || 0}
                  </p>
                  <p className="text-xs text-gray-500">Stock Bajo</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ErrorIcon className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.out_of_stock_count || 0}
                  </p>
                  <p className="text-xs text-gray-500">Sin Stock</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AttachMoneyIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-2xl font-bold text-gray-900">
                    ${((dashboardData?.total_products || 0) * 150).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Valor Est.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Banner PWA compacto */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <QrCodeScannerIcon className="h-6 w-6 mr-3" />
                <div>
                  <h3 className="font-semibold">Escáner PWA Próximamente</h3>
                  <p className="text-sm text-indigo-100">App instalable con cámara</p>
                </div>
              </div>
              <Link
                href="/scanner"
                className="px-4 py-2 bg-white text-indigo-600 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Búsqueda Manual
              </Link>
            </div>
          </div>

          {/* Contenido principal en grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Columna izquierda - Tendencias */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Top productos */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    Top Productos
                  </h3>
                  <SpeedIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="space-y-2">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {product.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {product.movements}
                        </span>
                        {product.trend === 'up' ? (
                          <TrendingUpIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDownIcon className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link
                  href="/products"
                  className="bg-white hover:bg-gray-50 rounded-lg p-3 shadow-sm transition-colors group"
                >
                  <div className="text-center">
                    <div className="p-2 bg-green-100 rounded-lg mx-auto w-fit mb-2 group-hover:scale-110 transition-transform">
                      <InventoryIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Productos</p>
                  </div>
                </Link>

                <Link
                  href="/products/new"
                  className="bg-white hover:bg-gray-50 rounded-lg p-3 shadow-sm transition-colors group"
                >
                  <div className="text-center">
                    <div className="p-2 bg-blue-100 rounded-lg mx-auto w-fit mb-2 group-hover:scale-110 transition-transform">
                      <AddIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Nuevo</p>
                  </div>
                </Link>

                <Link
                  href="/scanner"
                  className="bg-white hover:bg-gray-50 rounded-lg p-3 shadow-sm transition-colors group"
                >
                  <div className="text-center">
                    <div className="p-2 bg-purple-100 rounded-lg mx-auto w-fit mb-2 group-hover:scale-110 transition-transform">
                      <QrCodeScannerIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Escáner</p>
                  </div>
                </Link>

                <Link
                  href="/reports"
                  className="bg-white hover:bg-gray-50 rounded-lg p-3 shadow-sm transition-colors group"
                >
                  <div className="text-center">
                    <div className="p-2 bg-orange-100 rounded-lg mx-auto w-fit mb-2 group-hover:scale-110 transition-transform">
                      <AssessmentIcon className="h-5 w-5 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Reportes</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Columna derecha - Alertas y actividad */}
            <div className="space-y-4">
              
              {/* Alertas de stock */}
              {lowStockProducts.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      Alertas
                    </h3>
                    <WarningIcon className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="space-y-2">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="p-2 rounded bg-yellow-50 border-l-4 border-yellow-400">
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Stock: {product.stock} (Mín: {product.min_stock})
                        </p>
                      </div>
                    ))}
                  </div>
                  {lowStockProducts.length > 3 && (
                    <Link
                      href="/products?filter=low-stock"
                      className="text-sm text-blue-600 hover:text-blue-800 mt-2 block"
                    >
                      Ver todos ({lowStockProducts.length})
                    </Link>
                  )}
                </div>
              )}

              {/* Actividad reciente */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    Actividad
                  </h3>
                  <HistoryIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="space-y-2">
                  {recentMovements.map((movement, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          {movement.type === 'entrada' ? '↗️' : movement.type === 'salida' ? '↘️' : '🔄'} 
                          {movement.type}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(movement.created_at), 'dd/MM HH:mm', { locale: es })}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {movement.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/movements"
                  className="text-sm text-blue-600 hover:text-blue-800 mt-2 block"
                >
                  Ver historial completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}