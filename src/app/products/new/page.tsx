'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
// Removed useSuppliers import - suppliers functionality disabled
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { ProductCreate } from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

export default function NewProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createProduct, loading } = useProducts();
  // Suppliers functionality disabled
  
  const [formData, setFormData] = useState<ProductCreate>({
    code: '',
    name: '',
    description: '',
    stock: 0,
    min_stock: 5,
    price: 0
  });
  const [error, setError] = useState<string | null>(null);

  // Cargar código desde URL si viene del scanner
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setFormData(prev => ({
        ...prev,
        code: codeFromUrl
      }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' 
        ? (name === 'price' ? parseFloat(value) || 0 : parseInt(value) || 0)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.code.trim()) {
      setError('El código de barras es requerido');
      return;
    }
    if (!formData.name.trim()) {
      setError('El nombre del producto es requerido');
      return;
    }
    if (formData.stock !== undefined && formData.stock < 0) {
      setError('El stock actual no puede ser negativo');
      return;
    }
    if (formData.min_stock !== undefined && formData.min_stock < 0) {
      setError('El stock mínimo no puede ser negativo');
      return;
    }

    try {
      const product = await createProduct(formData);
      if (product) {
        router.push('/products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando producto');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowBackIcon className="h-4 w-4 mr-1" />
              Volver a productos
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
            <p className="mt-2 text-gray-600">Agrega un nuevo producto a tu inventario</p>
          </div>

          {/* Formulario */}
          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Código de Barras */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Código de Barras *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 7501234567890"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Código único que identifica el producto
                </p>
              </div>

              {/* Nombre */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Coca Cola 600ml"
                />
              </div>

              {/* Stock Actual */}
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock Actual
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Cantidad actual en inventario
                </p>
              </div>

              {/* Stock Mínimo */}
              <div>
                <label htmlFor="min_stock" className="block text-sm font-medium text-gray-700">
                  Stock Mínimo
                </label>
                <input
                  type="number"
                  id="min_stock"
                  name="min_stock"
                  min="0"
                  value={formData.min_stock}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Cantidad mínima antes de alertar por reposición
                </p>
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción (Opcional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descripción del producto"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Información adicional sobre el producto
                </p>
              </div>

              {/* Precio */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Precio
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Precio del producto en la moneda local
                </p>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  href="/products"
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
                      Crear Producto
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
              <li>• Usa códigos de barras únicos para cada producto</li>
              <li>• El stock mínimo te ayudará a recibir alertas de reposición</li>
              <li>• Puedes ajustar el stock después de crear el producto</li>
              <li>• Todos los campos marcados con * son obligatorios</li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}