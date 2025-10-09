'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabase';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  
  // Datos del perfil
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  
  // Cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Actualizar en la tabla users
      const { error: updateError } = await supabase
        .from('users')
        .update({
          username: profileData.username,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccess('Perfil actualizado correctamente');
      
      // Recargar la página después de 2 segundos para reflejar cambios
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validaciones
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccess('Contraseña actualizada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-4 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <PersonIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="text-sm text-gray-500">Gestiona tu información personal y configuración de seguridad</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <PersonIcon className="h-4 w-4 mr-2 inline" />
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  activeTab === 'security'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SecurityIcon className="h-4 w-4 mr-2 inline" />
                Seguridad
              </button>
            </div>

            <div className="p-6">
              {/* Mensajes */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {success}
                </div>
              )}

              {/* Tab: Información Personal */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Banner de Próximamente */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🚧</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-blue-900">
                          Edición de Perfil - Próximamente
                        </h3>
                        <p className="text-blue-700 mt-1">
                          Estamos trabajando en funcionalidades avanzadas de perfil que incluirán:
                        </p>
                        <ul className="text-sm text-blue-600 mt-2 space-y-1">
                          <li>• Edición completa de información personal</li>
                          <li>• Foto de perfil personalizada</li>
                          <li>• Configuración de preferencias</li>
                          <li>• Historial de actividad detallado</li>
                          <li>• Configuración de notificaciones por usuario</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Información actual (solo lectura) */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Información Actual de la Cuenta</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">ID de Usuario:</span>
                        <span className="font-mono text-gray-900">#{user?.id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="text-gray-900">{user?.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Usuario:</span>
                        <span className="text-gray-900">{user?.username || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estado:</span>
                        <span className="text-green-600 font-medium">Activo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cuenta creada:</span>
                        <span className="text-gray-900">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Última actualización:</span>
                        <span className="text-gray-900">
                          {user?.updated_at ? new Date(user.updated_at).toLocaleDateString('es-ES') : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones disponibles */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Acciones Disponibles</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        ✅ Cambiar contraseña (disponible en la pestaña "Seguridad")
                      </p>
                      <p className="text-sm text-gray-400">
                        🚧 Editar información personal (próximamente)
                      </p>
                      <p className="text-sm text-gray-400">
                        🚧 Subir foto de perfil (próximamente)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Seguridad */}
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña Actual
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.current ? (
                            <VisibilityOffIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <VisibilityIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.new ? (
                            <VisibilityOffIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <VisibilityIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Mínimo 6 caracteres
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nueva Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.confirm ? (
                            <VisibilityOffIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <VisibilityIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">⚠️ Importante</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Asegúrate de recordar tu nueva contraseña</li>
                      <li>• Usa una contraseña segura con letras, números y símbolos</li>
                      <li>• No compartas tu contraseña con nadie</li>
                    </ul>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <SecurityIcon className="h-4 w-4 mr-2" />
                      )}
                      {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}