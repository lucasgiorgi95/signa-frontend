import apiClient from './axios';
import { Supplier, SupplierCreate, SupplierUpdate } from '@/types';

export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    const response = await apiClient.get<Supplier[]>('/suppliers/');
    return response.data;
  },

  async getById(id: string): Promise<Supplier> {
    const response = await apiClient.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },

  async create(supplierData: SupplierCreate): Promise<Supplier> {
    const response = await apiClient.post<Supplier>('/suppliers/', supplierData);
    return response.data;
  },

  async update(id: string, supplierData: SupplierUpdate): Promise<Supplier> {
    const response = await apiClient.put<Supplier>(`/suppliers/${id}`, supplierData);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/suppliers/${id}`);
  }
};