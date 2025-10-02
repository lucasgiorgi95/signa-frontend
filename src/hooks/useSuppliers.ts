import { useState, useEffect } from 'react';
import { Supplier, SupplierCreate, SupplierUpdate } from '@/types';
import { supplierService } from '@/services/supplierService';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando proveedores');
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData: SupplierCreate): Promise<Supplier | null> => {
    setLoading(true);
    setError(null);
    try {
      const newSupplier = await supplierService.create(supplierData);
      setSuppliers(prev => [...prev, newSupplier]);
      return newSupplier;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando proveedor');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSupplier = async (id: string, supplierData: SupplierUpdate): Promise<Supplier | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedSupplier = await supplierService.update(id, supplierData);
      setSuppliers(prev => prev.map(s => s.id === id ? updatedSupplier : s));
      return updatedSupplier;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando proveedor');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await supplierService.delete(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando proveedor');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    error,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    clearError: () => setError(null)
  };
}