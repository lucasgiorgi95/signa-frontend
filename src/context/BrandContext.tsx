'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { marcaService, Marca as APIMarca } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

interface Brand extends Omit<APIMarca, 'id' | 'dueno' | 'nombre'> {
  id: string;
  name: string;
  owner: string;
  description: string;
  status?: 'active' | 'inactive';
}

type BrandContextType = {
  brands: Brand[];
  loading: boolean;
  error: string | null;
  addBrand: (brand: Omit<Brand, 'id'>) => Promise<void>;
  updateBrand: (id: string, updatedBrand: Omit<Brand, 'id'>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  getBrand: (id: string) => Brand | undefined;
  refreshBrands: () => Promise<void>;
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Cargar marcas solo cuando el usuario esté autenticado
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      refreshBrands();
    } else if (!authLoading && !isAuthenticated) {
      // Limpiar marcas si no está autenticado
      setBrands([]);
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // Función para refrescar la lista de marcas
  const refreshBrands = async () => {
    if (!isAuthenticated) {
      console.log('❌ No se pueden cargar marcas: usuario no autenticado');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Cargando marcas...');
      const marcas = await marcaService.getAll();
      setBrands(
        marcas.map((marca) => ({
          id: marca.id.toString(),
          name: marca.nombre,
          owner: marca.dueno,
          description: marca.descripcion || '',
        }))
      );
      console.log('✅ Marcas cargadas:', marcas.length);
    } catch (err) {
      setError('Error al cargar las marcas');
      console.error('Error fetching brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBrand = async (brand: Omit<Brand, 'id'>) => {
    try {
      const newBrand = await marcaService.create({
        nombre: brand.name,
        dueno: brand.owner,
        descripcion: brand.description,
      });
      
      setBrands([
        ...brands,
        {
          id: newBrand.id.toString(),
          name: newBrand.nombre,
          owner: newBrand.dueno,
          description: newBrand.descripcion || '',
        },
      ]);
    } catch (err) {
      setError('Error al crear la marca');
      console.error('Error adding brand:', err);
      throw err;
    }
  };

  const updateBrand = async (id: string, updatedBrand: Omit<Brand, 'id'>) => {
    try {
      await marcaService.update(Number(id), {
        nombre: updatedBrand.name,
        dueno: updatedBrand.owner,
        descripcion: updatedBrand.description,
      });
      
      setBrands(
        brands.map((brand) =>
          brand.id === id ? { ...updatedBrand, id } : brand
        )
      );
    } catch (err) {
      setError('Error al actualizar la marca');
      console.error('Error updating brand:', err);
      throw err;
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      await marcaService.delete(Number(id));
      setBrands(brands.filter((brand) => brand.id !== id));
    } catch (err) {
      setError('Error al eliminar la marca');
      console.error('Error deleting brand:', err);
      throw err;
    }
  };

  const getBrand = (id: string) => {
    return brands.find((brand) => brand.id === id);
  };

  return (
    <BrandContext.Provider
      value={{
        brands,
        loading,
        error,
        addBrand,
        updateBrand,
        deleteBrand,
        getBrand,
        refreshBrands,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrands() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrands must be used within a BrandProvider');
  }
  return context;
}
