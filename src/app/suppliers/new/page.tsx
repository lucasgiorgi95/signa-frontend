'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSuppliers } from '@/hooks/useSuppliers';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { SupplierCreate } from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';

export default function NewSupplierPage() {
  const router = useRouter();
  const { createSupplier, loading } = useSuppliers();
  
  const [formData, setFormData] = useState<SupplierCreate>({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre del proveedor es requerido');
      return;
    }

    try {
      const supplier = await createSupplier(formData);
      if (supplier) {
        router.push('/suppliers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando proveedor');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/suppliers"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowBackIcon className="h-4 w-4 mr-1" />
              Volver a proveedores
            </Link>
            <div className="flex items-center">
              <BusinessIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Nuevo Proveedor</h1>
                <p className="mt-2 text-gray-600">Agrega un nuevo proveedor a tu lista</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Nombre del Proveedor */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre del Proveedor *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Distribuidora ABC"
                />
              </div>

              {/* Persona de Contacto */}
              <div>
                <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700">
                  Persona de Contacto
                </label>
                <input
                  type="text"
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: +1 234 567 8900"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: contacto@distribuidoraabc.com"
                />
              </div>

              {/* Dirección */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Calle Principal 123, Ciudad, País"
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  href="/suppliers"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Crear Proveedor
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Consejos */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Consejos</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Solo el nombre es obligatorio, el resto de campos son opcionales</li>
              <li>• Puedes asociar productos con proveedores para facilitar reposiciones</li>
              <li>• La información de contacto te ayudará a comunicarte rápidamente</li>
              <li>• Puedes editar la información del proveedor en cualquier momento</li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}