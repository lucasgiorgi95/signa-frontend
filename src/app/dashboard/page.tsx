'use client';

import { useState, useEffect } from 'react';
import { useBrands } from '@/context/BrandContext';
import Link from 'next/link';
import EditBrandSidebar from '@/components/EditBrandSidebar';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import CategoryIcon from '@mui/icons-material/Category';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function Dashboard() {
  const { 
    brands, 
    deleteBrand, 
    loading, 
    error, 
    refreshBrands 
  } = useBrands();
  
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleEditClick = (id: string) => {
    setEditingBrandId(id);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setEditingBrandId(null);
    setIsSidebarOpen(false);
    refreshBrands();
  };

  // Calculate KPIs
  const totalBrands = brands.length;
  const activeBrands = brands.filter(brand => brand.status !== 'inactive').length;
  const latestBrands = [...brands].slice(-3).reverse();

  // Mostrar estado de carga
  if (loading && brands.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando marcas...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje de error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md mx-4">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar las marcas</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshBrands}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Panel de Control</h1>
          <p className="mt-3 text-lg text-gray-500">Administra todas tus marcas en un solo lugar</p>
        </div>
      
      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta Total de Marcas */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <CategoryIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total de Marcas</h3>
              <p className="text-3xl font-bold text-gray-900">{totalBrands}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Registradas en total</p>
          </div>
        </div>

        {/* Tarjeta Marcas Activas */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-10 -mt-10 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md">
              <CheckCircleIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Marcas Activas</h3>
              <p className="text-3xl font-bold text-gray-900">{activeBrands} <span className="text-base font-normal text-gray-500">de {totalBrands}</span></p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" 
                style={{ width: `${(activeBrands / Math.max(totalBrands, 1)) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{totalBrands > 0 ? Math.round((activeBrands / totalBrands) * 100) : 0}% activas</p>
          </div>
        </div>

        {/* Tarjeta Últimas Marcas */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-10 -mt-10 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md">
              <TrendingUpIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Últimas Marcas</h3>
              <p className="text-3xl font-bold text-gray-900">{latestBrands.length} <span className="text-base font-normal text-gray-500">recientes</span></p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex -space-x-2">
              {latestBrands.slice(0, 5).map((brand, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-medium text-indigo-700">
                  {brand.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {latestBrands.length === 0 && (
                <p className="text-xs text-gray-400">No hay marcas recientes</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Últimas Marcas */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Últimas Marcas Agregadas</h2>
              <p className="text-sm text-gray-500 mt-1">Gestiona todas tus marcas desde un solo lugar</p>
            </div>
            <Link 
              href="/brands/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <AddIcon className="-ml-1 mr-2 h-4 w-4" />
              Nueva Marca
            </Link>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <span>Nombre</span>
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dueño
                </th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p>No hay marcas registradas</p>
                      <Link 
                        href="/brands/new"
                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Crea tu primera marca →
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr 
                    key={brand.id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                          {brand.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                          <div className="text-xs text-gray-500">ID: {brand.id.substring(0, 6)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{brand.description || 'Sin descripción'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{brand.owner || 'No especificado'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleEditClick(brand.id)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center group"
                          title="Editar"
                        >
                          <EditIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('¿Estás seguro de que deseas eliminar esta marca?')) {
                              deleteBrand(brand.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 flex items-center group"
                          title="Eliminar"
                        >
                          <DeleteIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {brands.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-right">
            <p className="text-sm text-gray-500">
              Mostrando <span className="font-medium">{Math.min(brands.length, 10)}</span> de <span className="font-medium">{brands.length}</span> marcas
            </p>
          </div>
        )}
      </div>
      
      {/* Edit Brand Sidebar */}
      <div className={`fixed inset-0 z-50 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseSidebar}
            style={{
              transition: 'opacity 300ms, backdrop-filter 300ms',
              opacity: isSidebarOpen ? 1 : 0
            }}
          />
          <div 
            className="absolute inset-y-0 right-0 w-full max-w-md transform transition-transform duration-300 ease-in-out"
            style={{
              transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <EditBrandSidebar 
              brandId={editingBrandId} 
              onClose={handleCloseSidebar} 
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
