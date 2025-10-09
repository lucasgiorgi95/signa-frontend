'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useReports } from '@/hooks/useReports';
import ProtectedRoute from '@/components/ProtectedRoute';
import EditProductSidebar from '@/components/EditProductSidebar';
import Link from 'next/link';
import { Product } from '@/types';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import GetAppIcon from '@mui/icons-material/GetApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import BugReportIcon from '@mui/icons-material/BugReport';

export default function ProductsPage() {
  const { 
    products, 
    loading, 
    error, 
    deleteProduct, 
    fetchProducts 
  } = useProducts();
  
  const { 
    generateInventoryReport, 
    generateLowStockReport,
    loading: reportLoading 
  } = useReports();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'low-stock' | 'out-of-stock'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'low-stock') {
      return matchesSearch && product.stock <= product.min_stock && product.stock > 0;
    }
    if (filter === 'out-of-stock') {
      return matchesSearch && product.stock === 0;
    }
    return matchesSearch;
  });

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) {
      const success = await deleteProduct(id);
      if (success) {
        fetchProducts();
      }
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedProduct(null);
  };

  const handleSidebarSave = () => {
    fetchProducts(); // Refresh products list
  };

  if (loading && products.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                <p className="mt-2 text-gray-600">Gestiona tu inventario de productos</p>
              </div>
              <div className="flex space-x-3">
                {/* Dropdown de Exportar */}
                <div className="relative group">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <GetAppIcon className="h-4 w-4 mr-2" />
                    Exportar
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => generateInventoryReport('pdf')}
                        disabled={reportLoading}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <PictureAsPdfIcon className="h-4 w-4 mr-2 text-red-500" />
                        Inventario PDF
                      </button>
                      <button
                        onClick={() => generateInventoryReport('excel')}
                        disabled={reportLoading}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <TableViewIcon className="h-4 w-4 mr-2 text-green-500" />
                        Inventario Excel
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => generateLowStockReport('pdf')}
                        disabled={reportLoading}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <PictureAsPdfIcon className="h-4 w-4 mr-2 text-red-500" />
                        Stock Bajo PDF
                      </button>
                      <button
                        onClick={() => generateLowStockReport('excel')}
                        disabled={reportLoading}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <TableViewIcon className="h-4 w-4 mr-2 text-green-500" />
                        Stock Bajo Excel
                      </button>
                    </div>
                  </div>
                </div>
                
                <Link
                  href="/products/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <AddIcon className="h-4 w-4 mr-2" />
                  Nuevo Producto
                </Link>
              </div>
            </div>
          </div>

          {/* Filtros y Búsqueda */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filtros */}
              <div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos los productos</option>
                  <option value="low-stock">Stock bajo</option>
                  <option value="out-of-stock">Sin stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Lista de Productos */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <InventoryIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filter !== 'all' 
                    ? 'No se encontraron productos con los filtros aplicados'
                    : 'Comienza creando tu primer producto'
                  }
                </p>
                {!searchTerm && filter === 'all' && (
                  <div className="mt-6">
                    <Link
                      href="/products/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <AddIcon className="h-4 w-4 mr-2" />
                      Nuevo Producto
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <li key={product.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <InventoryIcon className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {product.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Código: {product.code}
                                </p>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900">
                                    Stock: {product.stock}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Mín: {product.min_stock}
                                  </p>
                                </div>
                                <div>
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
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Editar producto y stock"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Eliminar producto"
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
          {filteredProducts.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{filteredProducts.length}</p>
                  <p className="text-sm text-gray-500">Productos mostrados</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {filteredProducts.filter(p => p.stock <= p.min_stock && p.stock > 0).length}
                  </p>
                  <p className="text-sm text-gray-500">Stock bajo</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {filteredProducts.filter(p => p.stock === 0).length}
                  </p>
                  <p className="text-sm text-gray-500">Sin stock</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Product Sidebar */}
        <EditProductSidebar
          product={selectedProduct}
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
          onSave={handleSidebarSave}
        />
      </div>
    </ProtectedRoute>
  );
}