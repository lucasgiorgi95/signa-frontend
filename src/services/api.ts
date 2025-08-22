// Usar la variable de entorno o un valor por defecto
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ;


async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Error en la petición');
  }


  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}


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


export const marcaService = {

  async getAll(): Promise<Marca[]> {
    return fetchApi<Marca[]>('/marcas/');
  },

  async getById(id: number): Promise<Marca> {
    return fetchApi<Marca>(`/marcas/${id}`);
  },

 
  async create(marca: MarcaCreate): Promise<Marca> {
    return fetchApi<Marca>('/marcas/', {
      method: 'POST',
      body: JSON.stringify(marca),
    });
  },

  
  async update(id: number, marca: MarcaUpdate): Promise<Marca> {
    return fetchApi<Marca>(`/marcas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(marca),
    });
  },

 
  async delete(id: number): Promise<void> {
    return fetchApi<void>(`/marcas/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  marca: marcaService,
};
