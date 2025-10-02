'use client';

import { useState } from 'react';
import { useSuppliers } from '@/hooks/useSuppliers';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { Supplier } from '@/types';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function SuppliersPage() {
  const { 
    suppliers, 
    loading, 
    error, 
    deleteSupplier, 
    fetchSuppliers 
  } = useSuppliers();
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) {
      const success = await deleteSupplier(id);
      if (success) {
        fetchSuppliers();
      }
    }
  };

  if (loading && suppliers.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando proveedores...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
                <p className="mt-2 text-gray-600">Gestiona tus proveedores y facilita la reposición de stock</p>
              </div>
              <Link
                href="/suppliers/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <AddIcon className="h-4 w-4 mr-2" />
                Nuevo Proveedor
              </Link>
            </div>
          </div>

          {/* Búsqueda */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, contacto o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Lista de Proveedores */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {filteredSuppliers.length === 0 ? (
              <div className="text-center py-12">
                <BusinessIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proveedores</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm 
                    ? 'No se encontraron proveedores con los criterios de búsqueda'
                    : 'Comienza agregando tu primer proveedor'
                  }
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <Link
                      href="/suppliers/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <AddIcon className="h-4 w-4 mr-2" />
                      Nuevo Proveedor
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredSuppliers.map((supplier) => (
                  <li key={supplier.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <BusinessIcon className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {supplier.name}
                                </p>
                                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                  {supplier.contact_person && (
                                    <div className="flex items-center">
                                      <PersonIcon className="h-4 w-4 mr-1" />
                                      {supplier.contact_person}
                                    </div>
                                  )}
                                  {supplier.phone && (
                                    <div className="flex items-center">
                                      <PhoneIcon className="h-4 w-4 mr-1" />
                                      {supplier.phone}
                                    </div>
                                  )}
                                  {supplier.email && (
                                    <div className="flex items-center">
                                      <EmailIcon className="h-4 w-4 mr-1" />
                                      {supplier.email}
                                    </div>
                                  )}
                                </div>
                                {supplier.address && (
                                  <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <LocationOnIcon className="h-4 w-4 mr-1" />
                                    {supplier.address}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          href={`/suppliers/${supplier.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Editar proveedor"
                        >
                          <EditIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(supplier.id, supplier.name)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Eliminar proveedor"
                        >
                          <DeleteIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Estadísticas */}
          {filteredSuppliers.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{filteredSuppliers.length}</p>
                <p className="text-sm text-gray-500">
                  {searchTerm ? 'Proveedores encontrados' : 'Total de proveedores'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}