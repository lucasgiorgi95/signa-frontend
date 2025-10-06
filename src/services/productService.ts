import apiClient from './axios';
import { Product, ProductCreate, ProductUpdate } from '@/types';

interface ProductResponse {
  success: boolean;
  data: Product | Product[];
  message?: string;
  pagination?: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export const productService = {
  async getAll(params?: { page?: number; limit?: number; search?: string }): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const response = await apiClient.get<ProductResponse>(`/products?${queryParams.toString()}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error obteniendo productos');
    }
    
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  async getByCode(code: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<ProductResponse>(`/products/search?code=${encodeURIComponent(code)}`);
      
      if (!response.data.success) {
        return null;
      }
      
      return response.data.data as Product;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<ProductResponse>(`/products/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error obteniendo producto');
    }
    
    return response.data.data as Product;
  },

  async create(productData: ProductCreate): Promise<Product> {
    const response = await apiClient.post<ProductResponse>('/products', productData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error creando producto');
    }
    
    return response.data.data as Product;
  },

  async update(id: string, productData: ProductUpdate): Promise<Product> {
    const response = await apiClient.put<ProductResponse>(`/products/${id}`, productData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error actualizando producto');
    }
    
    return response.data.data as Product;
  },

  async delete(id: string): Promise<void> {
    const response = await apiClient.delete<ProductResponse>(`/products/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error eliminando producto');
    }
  },

  async getLowStock(): Promise<Product[]> {
    const response = await apiClient.get<ProductResponse>('/products/low-stock');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error obteniendo productos con stock bajo');
    }
    
    return Array.isArray(response.data.data) ? response.data.data : [];
  }
};