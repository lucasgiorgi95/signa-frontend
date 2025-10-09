'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useStock } from '@/hooks/useStock';
import { useProducts } from '@/hooks/useProducts';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { Product } from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Save';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function AdjustStockPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { quickAdjust, loading } = useStock();
  const { searchByCode } = useProducts();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [movementType, setMovementType] = useState<string>("entrada");
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const code = searchParams.get('code');
        if (code) {
          // Buscar por código si viene del scanner
          const foundProduct = await searchByCode(code);
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setError('Producto no encontrado');
          }
        } else {
          // Cargar por ID (implementar productService.getById)
          // Por ahora usamos datos mock
          const mockProduct: Product = {
            id: parseInt(params.id as string) || 1,
            code: '123456789',
            name: 'Producto de Ejemplo',
            stock: 50,
            min_stock: 10,
            price: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setProduct(mockProduct);
        }
      } catch (err) {
        setError('Error cargando producto');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.id, searchParams]);

  const handleQuickAdjust = async (amount: number) => {
    if (!product) return;
    
    setQuantity(Math.abs(amount));
    setMovementType(amount > 0 ? "entrada" : "salida");
    
    try {
      const movement = await quickAdjust(
        product.id, 
        amount, 
        `Ajuste rápido: ${amount > 0 ? '+' : ''}${amount}`
      );
      
      if (movement) {
        // Actualizar el stock local
        setProduct(prev => prev ? {
          ...prev,
          stock: prev.stock + amount
        } : null);
        
        // Limpiar formulario
        setQuantity(0);
        setReason('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error ajustando stock');
    }
  };

  const handleManualAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || quantity === 0) return;

    setError(null);
    
    try {
      const adjustmentAmount = movementType === "salida" ? -quantity : quantity;
      const movement = await quickAdjust(
        product.id,
        adjustmentAmount,
        reason || `Ajuste manual: ${movementType}`
      );
      
      if (movement) {
        // Actualizar el stock local
        setProduct(prev => prev ? {
          ...prev,
          stock: prev.stock + adjustmentAmount
        } : null);
        
        // Limpiar formulario
        setQuantity(0);
        setReason('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error ajustando stock');
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

  if (!product) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
            <p className="text-gray-600 mb-4">No se pudo cargar la información del producto</p>
            <Link
              href="/products"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Volver a Productos
            </Link>
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
            <h1 className="text-3xl font-bold text-gray-900">Ajustar Stock</h1>
            <p className="mt-2 text-gray-600">Modifica el inventario del producto</p>
          </div>

          {/* Info del Producto */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <InventoryIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                <p className="text-sm text-gray-500">Código: {product.code}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Stock actual: <span className="font-semibold text-lg">{product.stock}</span>
                  </span>
                  <span className="text-sm text-gray-700">
                    Stock mínimo: <span className="font-medium">{product.min_stock}</span>
                  </span>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.stock === 0
                      ? 'bg-red-100 text-red-800'
                      : product.stock <= product.min_stock
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {product.stock === 0
                      ? 'Sin stock'
                      : product.stock <= product.min_stock
                      ? 'Stock bajo'
                      : 'En stock'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botones Rápidos */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ajustes Rápidos</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Entradas */}
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-3">Entrada (+)</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 5, 10].map((amount) => (
                    <button
                      key={`in-${amount}`}
                      onClick={() => handleQuickAdjust(amount)}
                      disabled={loading}
                      className="flex items-center justify-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50"
                    >
                      <AddIcon className="h-4 w-4 mr-1" />
                      {amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salidas */}
              <div>
                <h4 className="text-sm font-medium text-red-700 mb-3">Salida (-)</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 5, 10].map((amount) => (
                    <button
                      key={`out-${amount}`}
                      onClick={() => handleQuickAdjust(-amount)}
                      disabled={loading || product.stock < amount}
                      className="flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                    >
                      <RemoveIcon className="h-4 w-4 mr-1" />
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ajuste Manual */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ajuste Manual</h3>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleManualAdjust} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="movementType" className="block text-sm font-medium text-gray-700">
                    Tipo de Movimiento
                  </label>
                  <select
                    id="movementType"
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="entrada">Entrada (+)</option>
                    <option value="salida">Salida (-)</option>
                    <option value="ajuste">Ajuste</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Razón (opcional)
                </label>
                <input
                  type="text"
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Venta, Compra, Inventario físico..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || quantity === 0}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Aplicar Ajuste
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Acciones adicionales */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">¿Necesitas ver el historial?</span>
              <Link
                href={`/movements/product/${product.id}`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver Movimientos →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}