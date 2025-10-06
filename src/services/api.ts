// Exportar todos los servicios
export { authService } from './authService';
export { productService } from './productService';
export { stockService } from './stockService';
export { movementService } from './movementService';

// Importar apiClient para usar en el servicio de marcas
import apiClient from './axios';

export interface Marca {
  id: number;
  nombre: string;
  dueno: string;
  descripcion?: string;
}

export interface MarcaCreate {
  nombre: string;
  dueno: string;
  descripcion?: string;
}

export interface MarcaUpdate {
  nombre?: string;
  dueno?: string;
  descripcion?: string;
}

interface MarcaResponse {
  success: boolean;
  data: Marca | Marca[];
  message?: string;
}

export const marcaService = {
  async getAll(): Promise<Marca[]> {
    const response = await apiClient.get<MarcaResponse>('/marcas');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error obteniendo marcas');
    }
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  async getById(id: number): Promise<Marca> {
    const response = await apiClient.get<MarcaResponse>(`/marcas/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error obteniendo marca');
    }
    return response.data.data as Marca;
  },

  async create(marca: MarcaCreate): Promise<Marca> {
    const response = await apiClient.post<MarcaResponse>('/marcas', marca);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error creando marca');
    }
    return response.data.data as Marca;
  },

  async update(id: number, marca: MarcaUpdate): Promise<Marca> {
    const response = await apiClient.put<MarcaResponse>(`/marcas/${id}`, marca);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error actualizando marca');
    }
    return response.data.data as Marca;
  },

  async delete(id: number): Promise<void> {
    const response = await apiClient.delete<MarcaResponse>(`/marcas/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error eliminando marca');
    }
  },
};

export default {
  marca: marcaService,
};
