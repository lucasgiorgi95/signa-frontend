import { supabase } from '@/lib/supabase';
import { Product, ProductCreate, ProductUpdate } from '@/types';

export const productService = {
  async getAll(params?: { page?: number; limit?: number; search?: string }): Promise<Product[]> {
    let query = supabase.from('products').select('*');
    
    // Aplicar filtro de búsqueda si existe
    if (params?.search) {
      query = query.or(`name.ilike.%${params.search}%,code.ilike.%${params.search}%`);
    }
    
    // Aplicar paginación si existe
    if (params?.page && params?.limit) {
      const from = (params.page - 1) * params.limit;
      const to = from + params.limit - 1;
      query = query.range(from, to);
    }
    
    // Ordenar por fecha de creación
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(error.message || 'Error obteniendo productos');
    }
    
    return data || [];
  },

  async getByCode(code: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('code', code)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      throw new Error(error.message);
    }
    
    return data;
  },

  async getById(id: number): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw new Error(error.message || 'Error obteniendo producto');
    }
    
    return data;
  },

  async create(productData: ProductCreate): Promise<Product> {
    console.log('🔄 Creando producto:', productData);
    
    const insertData = {
      code: productData.code,
      name: productData.name,
      description: productData.description,
      stock: productData.stock || 0,
      min_stock: productData.min_stock || 5, // Default según tu esquema
      price: 0, // Campo requerido en tu esquema
    };
    
    console.log('📦 Datos a insertar:', insertData);
    
    const { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creando producto:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      
      // Manejar errores específicos
      if (error.code === '23505') {
        throw new Error('Ya existe un producto con ese código de barras');
      }
      
      if (error.code === '42501') {
        throw new Error('No tienes permisos para crear productos');
      }
      
      if (error.code === '23502') {
        throw new Error('Faltan campos requeridos');
      }
      
      // Si el error no tiene mensaje, usar el código o un mensaje genérico
      const errorMessage = error.message || error.details || error.hint || `Error de base de datos (código: ${error.code})` || 'Error creando producto';
      throw new Error(errorMessage);
    }
    
    console.log('✅ Producto creado:', data);
    return data;
  },

  async update(id: number, productData: ProductUpdate): Promise<Product> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (productData.code !== undefined) updateData.code = productData.code;
    if (productData.name !== undefined) updateData.name = productData.name;
    if (productData.description !== undefined) updateData.description = productData.description;
    if (productData.stock !== undefined) updateData.stock = productData.stock;
    if (productData.min_stock !== undefined) updateData.min_stock = productData.min_stock;
    if (productData.price !== undefined) updateData.price = productData.price;
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message || 'Error actualizando producto');
    }
    
    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message || 'Error eliminando producto');
    }
  },

  async getLowStock(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or('stock.eq.0,stock.lte.min_stock')
      .order('stock', { ascending: true });
    
    if (error) {
      throw new Error(error.message || 'Error obteniendo productos con stock bajo');
    }
    
    return data || [];
  }
};