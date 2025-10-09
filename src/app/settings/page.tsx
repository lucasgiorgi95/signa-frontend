'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import PaletteIcon from '@mui/icons-material/Palette';
import StorageIcon from '@mui/icons-material/Storage';

interface AppSettings {
  currency: string;
  language: string;
  dateFormat: string;
  itemsPerPage: number;
  lowStockThreshold: number;
  notifications: {
    lowStock: boolean;
    outOfStock: boolean;
    newMovements: boolean;
    email: boolean;
  };
  theme: string;
  autoRefresh: boolean;
  refreshInterval: number;
}

const defaultSettings: AppSettings = {
  currency: 'USD',
  language: 'es',
  dateFormat: 'dd/MM/yyyy',
  itemsPerPage: 10,
  lowStockThreshold: 5,
  notifications: {
    lowStock: true,
    outOfStock: true,
    newMovements: false,
    email: false
  },
  theme: 'light',
  autoRefresh: true,
  refreshInterval: 300000 // 5 minutos
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cargar configuración desde localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (err) {
        console.error('Error parsing settings:', err);
      }
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Guardar en localStorage
      localStorage.setItem('app_settings', JSON.stringify(settings));
      
      // Aquí podrías también guardar en Supabase si quieres sincronizar entre dispositivos
      setSuccess('Configuración guardada correctamente');
      
    } catch (err) {
      setError('Error guardando la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto?')) {
      setSettings(defaultSettings);
      localStorage.removeItem('app_settings');
      setSuccess('Configuración restaurada a valores por defecto');
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-4 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SettingsIcon className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Configuración</h1>
                  <p className="text-sm text-gray-500">Personaliza la aplicación según tus preferencias</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center"
                >
                  <RestoreIcon className="h-4 w-4 mr-1" />
                  Restaurar
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                  ) : (
                    <SaveIcon className="h-4 w-4 mr-1" />
                  )}
                  Guardar
                </button>
              </div>
            </div>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Configuración General */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <LanguageIcon className="h-5 w-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Configuración General</h2>
            </div>
            
            {/* Banner de Próximamente */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-amber-900">
                    Configuración Avanzada - En Desarrollo
                  </h3>
                  <p className="text-amber-700 text-sm mt-1">
                    Próximamente: Personalización completa de moneda, idioma, formatos y más opciones avanzadas.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Configuración básica disponible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda (Próximamente)
                </label>
                <select
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                >
                  <option>USD - Dólar Americano</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma (Próximamente)
                </label>
                <select
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                >
                  <option>Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato de Fecha (Próximamente)
                </label>
                <select
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                >
                  <option>DD/MM/YYYY</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Elementos por Página
                </label>
                <select
                  value={settings.itemsPerPage}
                  onChange={(e) => updateSetting('itemsPerPage', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <p className="text-xs text-green-600 mt-1">✅ Funcional</p>
              </div>
            </div>
          </div>

          {/* Configuración de Inventario */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <StorageIcon className="h-5 w-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Inventario</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Umbral de Stock Bajo (por defecto)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.lowStockThreshold}
                  onChange={(e) => updateSetting('lowStockThreshold', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Valor por defecto para nuevos productos
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-actualización
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.autoRefresh}
                      onChange={(e) => updateSetting('autoRefresh', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Activar</span>
                  </label>
                  
                  {settings.autoRefresh && (
                    <select
                      value={settings.refreshInterval}
                      onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={60000}>1 minuto</option>
                      <option value={300000}>5 minutos</option>
                      <option value={600000}>10 minutos</option>
                      <option value={1800000}>30 minutos</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Configuración de Notificaciones */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <NotificationsIcon className="h-5 w-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Alertas de Stock Bajo</h3>
                  <p className="text-sm text-gray-500">Notificar cuando productos tengan stock bajo</p>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.lowStock}
                    onChange={(e) => updateNotificationSetting('lowStock', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Alertas de Sin Stock</h3>
                  <p className="text-sm text-gray-500">Notificar cuando productos se agoten</p>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.outOfStock}
                    onChange={(e) => updateNotificationSetting('outOfStock', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Nuevos Movimientos</h3>
                  <p className="text-sm text-gray-500">Notificar sobre actividad reciente</p>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.newMovements}
                    onChange={(e) => updateNotificationSetting('newMovements', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Notificaciones por Email</h3>
                  <p className="text-sm text-gray-500">Recibir alertas importantes por correo</p>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => updateNotificationSetting('email', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Configuración de Apariencia */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <PaletteIcon className="h-5 w-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Apariencia</h2>
            </div>
            
            {/* Banner de Próximamente */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎨</span>
                <div>
                  <h3 className="text-sm font-semibold text-purple-900">
                    Temas Personalizados - Próximamente
                  </h3>
                  <p className="text-purple-700 text-sm mt-1">
                    Modo oscuro, temas personalizados y opciones de accesibilidad en desarrollo.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={true}
                    readOnly
                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Claro ✅</span>
                </label>
                <label className="flex items-center opacity-50">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    disabled
                    className="border-gray-300 text-gray-400"
                  />
                  <span className="ml-2 text-sm text-gray-400">Oscuro 🚧</span>
                </label>
                <label className="flex items-center opacity-50">
                  <input
                    type="radio"
                    name="theme"
                    value="auto"
                    disabled
                    className="border-gray-300 text-gray-400"
                  />
                  <span className="ml-2 text-sm text-gray-400">Automático 🚧</span>
                </label>
              </div>
            </div>
          </div>

          {/* Información de la Aplicación */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de la Aplicación</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-500">Versión:</span>
                <span className="ml-2 text-gray-900 font-medium">1.0.0 Beta</span>
              </div>
              <div>
                <span className="text-gray-500">Última actualización:</span>
                <span className="ml-2 text-gray-900">{new Date().toLocaleDateString('es-ES')}</span>
              </div>
              <div>
                <span className="text-gray-500">Usuario:</span>
                <span className="ml-2 text-gray-900">{user?.username}</span>
              </div>
              <div>
                <span className="text-gray-500">Configuración guardada:</span>
                <span className="ml-2 text-gray-900">Localmente</span>
              </div>
            </div>

            {/* Roadmap rápido */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">🚀 Próximas Funcionalidades</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• Backup/Restore de datos completos</div>
                <div>• PWA con escáner de cámara</div>
                <div>• Múltiples ubicaciones y almacenes</div>
                <div>• Gestión avanzada de usuarios y permisos</div>
                <div>• Integración con sistemas externos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}