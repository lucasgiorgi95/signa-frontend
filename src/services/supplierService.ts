import apiClient from './axios';
import { Supplier, SupplierCreate, SupplierUpdate } from '@/types';

interface SupplierResponse {
  success: boolean;
  data: Supplier | Supplier[];
  message?: string;
  pagination?: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export const supplierService = {
  async getAll(params?: { page?: number; limit?: number; search?: string }): Promise<Supplier[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const response = await apiClient.get<SupplierResponse>(`/suppliers?${queryParams.toString()}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error obteniendo proveedores');
    }
    
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  async getById(id: string): Promise<Supplier> {
    const response = await apiClient.get<SupplierResponse>(`/suppliers/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error obteniendo proveedor');
    }
    
    return response.data.data as Supplier;
  },

  async create(supplierData: SupplierCreate): Promise<Supplier> {
    const response = await apiClient.post<SupplierResponse>('/suppliers', supplierData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error creando proveedor');
    }
    
    return response.data.data as Supplier;
  },

  async update(id: string, supplierData: SupplierUpdate): Promise<Supplier> {
    const response = await apiClient.put<SupplierResponse>(`/suppliers/${id}`, supplierData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error actualizando proveedor');
    }
    
    return response.data.data as Supplier;
  },

  async delete(id: string): Promise<void> {
    const response = await apiClient.delete<SupplierResponse>(`/suppliers/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error eliminando proveedor');
    }
  }
};