import { useState, useEffect } from 'react';
import { Product, ProductCreate, ProductUpdate } from '@/types';
import { productService } from '@/services/productService';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  const searchByCode = async (code: string): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const product = await productService.getByCode(code);
      return product;
    } catch (err) {
      if (err instanceof Error && err.message.includes('404')) {
        return null; // Producto no encontrado
      }
      setError(err instanceof Error ? err.message : 'Error buscando producto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: ProductCreate): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await productService.create(productData);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando producto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: ProductUpdate): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await productService.update(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando producto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando producto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getLowStockProducts = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const lowStockProducts = await productService.getLowStock();
      return lowStockProducts;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando productos con stock bajo');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    searchByCode,
    createProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    clearError: () => setError(null)
  };
}