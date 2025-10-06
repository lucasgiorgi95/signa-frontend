'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ComingSoonIcon from '@mui/icons-material/Schedule';

export default function ScannerPage() {
  const router = useRouter();
  const { searchByCode } = useProducts();
  
  const [manualCode, setManualCode] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    setIsSearching(true);
    setError(null);
    setSearchResult(null);

    try {
      const product = await searchByCode(manualCode.trim());
      if (product) {
        setSearchResult(product);
      } else {
        setSearchResult(null);
        setError('Producto no encontrado');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error buscando producto');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateProduct = () => {
    const code = manualCode.trim();
    if (code) {
      router.push(`/products/new?code=${encodeURIComponent(code)}`);
    } else {
      router.push('/products/new');
    }
  };

  const handleAdjustStock = () => {
    if (searchResult) {
      router.push(`/products/${searchResult.id}/adjust`);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <QrCodeScannerIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Scanner de Códigos</h1>
            <p className="mt-2 text-gray-600">Escanea o ingresa manualmente el código de barras</p>
          </div>

          {/* Anuncio de Próximamente */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <PhoneAndroidIcon className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    📱 Escáner de Cámara - Próximamente
                  </h3>
                  <p className="text-sm text-blue-700">
                    Disponible en la versión PWA con escáner en tiempo real, funcionamiento offline e instalación como app nativa.
                  </p>
                </div>
              </div>
              <ComingSoonIcon className="h-5 w-5 text-blue-500" />
            </div>
          </div>

          {/* Búsqueda Manual */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Búsqueda Manual</h2>
            
            <form onSubmit={handleManualSearch} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Barras
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    id="code"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Ingresa el código de barras..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isSearching || !manualCode.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Buscando...
                      </>
                    ) : (
                      <>
                        <SearchIcon className="h-4 w-4 mr-2" />
                        Buscar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Resultado de Búsqueda */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-red-800">Producto no encontrado</h3>
                  <p className="text-sm text-red-700 mt-1">
                    No se encontró un producto con el código "{manualCode}"
                  </p>
                </div>
                <button
                  onClick={handleCreateProduct}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  <AddIcon className="h-4 w-4 mr-1" />
                  Crear Producto
                </button>
              </div>
            </div>
          )}

          {searchResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <InventoryIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-green-900">{searchResult.name}</h3>
                    <p className="text-sm text-green-700">Código: {searchResult.code}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-sm text-green-700">
                        Stock actual: <span className="font-medium">{searchResult.current_stock}</span>
                      </span>
                      <span className="text-sm text-green-700">
                        Stock mínimo: <span className="font-medium">{searchResult.min_stock}</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        searchResult.current_stock === 0
                          ? 'bg-red-100 text-red-800'
                          : searchResult.current_stock <= searchResult.min_stock
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {searchResult.current_stock === 0
                          ? 'Sin stock'
                          : searchResult.current_stock <= searchResult.min_stock
                          ? 'Stock bajo'
                          : 'En stock'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleAdjustStock}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Ajustar Stock
                </button>
              </div>
            </div>
          )}

          {/* Acciones Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/products"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <InventoryIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Ver Productos</h3>
                  <p className="text-sm text-gray-500">Gestionar inventario completo</p>
                </div>
              </div>
            </Link>

            <Link
              href="/products/new"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AddIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Nuevo Producto</h3>
                  <p className="text-sm text-gray-500">Agregar al inventario</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Instrucciones */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-amber-800 mb-2">💡 Cómo usar la búsqueda manual</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>1. Ingresa manualmente el código de barras en el campo de búsqueda</li>
              <li>2. Si el producto existe, podrás ajustar su stock directamente</li>
              <li>3. Si no existe, podrás crear un nuevo producto con ese código</li>
              <li>4. El escáner de cámara estará disponible en la versión PWA</li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}