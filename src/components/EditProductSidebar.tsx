'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { useProducts } from '@/hooks/useProducts';
import { useStock } from '@/hooks/useStock';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditIcon from '@mui/icons-material/Edit';

interface EditProductSidebarProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function EditProductSidebar({ 
  product, 
  isOpen, 
  onClose, 
  onSave 
}: EditProductSidebarProps) {
  const { updateProduct, loading: productLoading } = useProducts();
  const { adjustStock, loading: stockLoading } = useStock();
  const [activeTab, setActiveTab] = useState<'product' | 'stock'>('product');
  
  // Estados para edición de producto
  const [productData, setProductData] = useState({
    name: '',
    code: '',
    description: '',
    min_stock: 0,
    price: 0
  });
  
  // Estados para ajuste de stock
  const [stockData, setStockData] = useState({
    quantity: 0,
    reason: '',
    notes: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name,
        code: product.code,
        description: product.description || '',
        min_stock: product.min_stock,
        price: product.price || 0
      });
      setStockData({
        quantity: product.stock,
        reason: '',
        notes: ''
      });
    }
  }, [product]);

  const handleProductSave = async () => {
    if (!product) return;
    
    setError(null);
    setSuccess(null);
    
    try {
      await updateProduct(product.id, productData);
      setSuccess('Producto actualizado correctamente');
      setTimeout(() => {
        onSave();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar producto');
    }
  }; 
 const handleStockSave = async () => {
    if (!product) return;
    
    setError(null);
    setSuccess(null);
    
    try {
      await adjustStock({
        product_id: product.id,
        quantity: stockData.quantity,
        type: stockData.quantity > product.stock ? 'entrada' : 'salida',
        reason: stockData.reason
      });
      setSuccess('Stock ajustado correctamente');
      setTimeout(() => {
        onSave();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al ajustar stock');
    }
  };

  if (!isOpen || !product) return null;

  return (
    <>
      {/* Overlay with Blur */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-500 ease-out ${
          isOpen 
            ? 'backdrop-blur-md bg-gray-900/30 opacity-100' 
            : 'backdrop-blur-none bg-gray-900/0 opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-all duration-500 ease-out ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 transition-all duration-300 delay-100 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <h2 className="text-lg font-semibold text-gray-900">
            Editar: {product.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b border-gray-200 transition-all duration-300 delay-200 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <button
            onClick={() => setActiveTab('product')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'product'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <EditIcon className="h-4 w-4 mr-2 inline" />
            Producto
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'stock'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <InventoryIcon className="h-4 w-4 mr-2 inline" />
            Stock
          </button>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto p-6 transition-all duration-300 delay-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Messages */}
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

          {/* Product Tab */}
          {activeTab === 'product' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código
                </label>
                <input
                  type="text"
                  value={productData.code}
                  onChange={(e) => setProductData(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={productData.description}
                  onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    value={productData.min_stock}
                    onChange={(e) => setProductData(prev => ({ ...prev, min_stock: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productData.price}
                    onChange={(e) => setProductData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Stock Tab */}
          {activeTab === 'stock' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Stock Actual</h3>
                <p className="text-2xl font-bold text-blue-600">{product.stock}</p>
                <p className="text-sm text-gray-500">Stock mínimo: {product.min_stock}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo Stock
                </label>
                <input
                  type="number"
                  value={stockData.quantity}
                  onChange={(e) => setStockData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Diferencia: {stockData.quantity - product.stock > 0 ? '+' : ''}{stockData.quantity - product.stock}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo del Ajuste
                </label>
                <input
                  type="text"
                  value={stockData.reason}
                  onChange={(e) => setStockData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Ej: Inventario físico, Venta, Compra..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (Opcional)
                </label>
                <textarea
                  value={stockData.notes}
                  onChange={(e) => setStockData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`border-t border-gray-200 p-6 transition-all duration-300 delay-400 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={activeTab === 'product' ? handleProductSave : handleStockSave}
              disabled={productLoading || stockLoading}
              className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {(productLoading || stockLoading) ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </div>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4 mr-2 inline" />
                  Guardar {activeTab === 'product' ? 'Producto' : 'Stock'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}