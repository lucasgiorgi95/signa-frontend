'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { Product, ProductUpdate } from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { updateProduct, loading } = useProducts();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductUpdate>({
    code: '',
    name: '',
    current_stock: 0,
    min_stock: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Simular carga del producto (en una implementación real usarías productService.getById)
        // Por ahora usamos datos mock
        const mockProduct: Product = {
          id: params.id as string,
          code: '123456789',
          name: 'Producto de Ejemplo',
          current_stock: 50,
          min_stock: 10,
          user_id: 'user-1',
          created_at: new Date().toISOString()
        };
        
        setProduct(mockProduct);
        setFormData({
          code: mockProduct.code,
          name: mockProduct.name,
          current_stock: mockProduct.current_stock,
          min_stock: mockProduct.min_stock
        });
      } catch (err) {
        setError('Error cargando producto');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.code?.trim()) {
      setError('El código de barras es requerido');
      return;
    }
    if (!formData.name?.trim()) {
      setError('El nombre del producto es requerido');
      return;
    }

    try {
      const updatedProduct = await updateProduct(params.id as string, formData);
      if (updatedProduct) {
        router.push('/products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando producto');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando producto...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
            <p className="mt-2 text-gray-600">Modifica la información del producto</p>
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
                />
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
                />
              </div>

              {/* Stock Actual */}
              <div>
                <label htmlFor="current_stock" className="block text-sm font-medium text-gray-700">
                  Stock Actual
                </label>
                <input
                  type="number"
                  id="current_stock"
                  name="current_stock"
                  min="0"
                  value={formData.current_stock}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Para ajustes de stock, usa la función de ajuste específica
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
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  href="/products"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Acciones adicionales */}
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Adicionales</h3>
            <div className="flex space-x-4">
              <Link
                href={`/products/${params.id}/adjust`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Ajustar Stock
              </Link>
              <Link
                href={`/movements/product/${params.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Ver Historial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}