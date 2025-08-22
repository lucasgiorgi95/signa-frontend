'use client';

import { useBrands } from '@/context/BrandContext';
import { useState, useEffect, useRef } from 'react';
import { Brand, BrandFormData } from '@/types';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { Alert, AlertRef } from './Alert';

// Using BrandFormData from types

type EditBrandSidebarProps = {
  brandId: string | null;
  onClose: () => void;
};

export default function EditBrandSidebar({ brandId, onClose }: EditBrandSidebarProps) {
  const { getBrand, updateBrand } = useBrands();
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    description: '',
    owner: '',
  });
  const alertRef = useRef<AlertRef>(null);

  useEffect(() => {
    if (brandId) {
      const brand = getBrand(brandId);
      if (brand) {
        setFormData({
          name: brand.name,
          description: brand.description || '',
          owner: brand.owner,
        });
      }
    } else {
      // Reset form when sidebar is closed
      setFormData({
        name: '',
        description: '',
        owner: '',
      });
    }
  }, [brandId, getBrand]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId) return;
    
    try {
      await updateBrand(brandId, formData);
      
      // Mostrar alerta de éxito
      alertRef.current?.show('¡Los cambios se guardaron correctamente!', 'success');
      
      // Cerrar el sidebar después de 1.5 segundos
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error actualizando marca:', error);
      // Mostrar alerta de error
      alertRef.current?.show('Error al guardar los cambios. Por favor, inténtalo de nuevo.', 'error');
    }
  };

  if (!brandId) return null;

  return (
    <>
      <Alert ref={alertRef} />
      <div className="fixed inset-0 z-40 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-indigo-800 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Editar Marca</h2>
                <p className="mt-1 text-sm text-blue-100">Actualiza la información de la marca</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="sr-only">Cerrar</span>
                <CloseIcon fontSize="medium" />
              </button>
            </div>
          </div>
          
          {/* Form */}
          <div className="flex-1 overflow-y-auto p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                  Nombre de la Marca <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm ring-1 ring-gray-300 transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Ej: Nike"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-800">
                  Descripción
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm ring-1 ring-gray-300 transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Ingresa una descripción de la marca"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="owner" className="block text-sm font-semibold text-gray-800">
                  Propietario <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="owner"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm ring-1 ring-gray-300 transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
              </div>
              
              {/* Footer */}
              <div className="border-t border-gray-100 bg-gray-50 px-0 py-5 -mx-8 -mb-8">
                <div className="flex justify-end space-x-3 px-8">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <CheckIcon className="mr-2" fontSize="small" />
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
