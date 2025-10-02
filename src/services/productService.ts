import apiClient from './axios';
import { Product, ProductCreate, ProductUpdate } from '@/types';

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products/');
    return response.data;
  },

  async getByCode(code: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/search/?code=${encodeURIComponent(code)}`);
    return response.data;
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  async create(productData: ProductCreate): Promise<Product> {
    const response = await apiClient.post<Product>('/products/', productData);
    return response.data;
  },

  async update(id: string, productData: ProductUpdate): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, productData);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },

  async getLowStock(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products/low-stock/');
    return response.data;
  }
};