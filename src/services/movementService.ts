import { supabase } from '@/lib/supabase';
import { StockMovement, StockMovementCreate } from '@/types';

export const movementService = {
  async create(movementData: StockMovementCreate): Promise<StockMovement> {
    // Obtener el usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Crear el movimiento
    const { data: movement, error: movementError } = await supabase
      .from('stock_movements')
      .insert({
        product_id: movementData.product_id,
        user_id: user.id,
        type: movementData.type,
        quantity: movementData.quantity,
        reason: movementData.reason || 'Movimiento de stock',
      })
      .select()
      .single();

    if (movementError) {
      throw new Error(movementError.message || 'Error creando movimiento');
    }

    // Actualizar el stock del producto
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', movementData.product_id)
      .single();

    if (productError) {
      throw new Error('Error obteniendo producto para actualizar stock');
    }

    let newStock = product.stock;
    if (movementData.type === "entrada") {
      newStock += movementData.quantity;
    } else if (movementData.type === "salida") {
      newStock -= movementData.quantity;
    } else if (movementData.type === "ajuste") {
      newStock = movementData.quantity; // Para ajustes, la cantidad es el nuevo stock
    }

    // Asegurar que el stock no sea negativo
    if (newStock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        stock: newStock,
        updated_at: new Date().toISOString()
      })
      .eq('id', movementData.product_id);

    if (updateError) {
      throw new Error('Error actualizando stock del producto');
    }

    return movement;
  },

  async getByProduct(productId: number, params?: { page?: number; limit?: number }): Promise<StockMovement[]> {
    let query = supabase
      .from('stock_movements')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    // Aplicar paginación si existe
    if (params?.page && params?.limit) {
      const from = (params.page - 1) * params.limit;
      const to = from + params.limit - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message || 'Error obteniendo movimientos');
    }

    return data || [];
  },

  async getAll(params?: { 
    page?: number; 
    limit?: number; 
    dateFrom?: string; 
    dateTo?: string;
    type?: string;
  }): Promise<StockMovement[]> {
    let query = supabase
      .from('stock_movements')
      .select('*')
      .order('created_at', { ascending: false });

    // Filtros de fecha
    if (params?.dateFrom) {
      query = query.gte('created_at', params.dateFrom);
    }
    if (params?.dateTo) {
      query = query.lte('created_at', params.dateTo);
    }

    // Filtro por tipo
    if (params?.type) {
      query = query.eq('type', params.type);
    }

    // Paginación
    if (params?.page && params?.limit) {
      const from = (params.page - 1) * params.limit;
      const to = from + params.limit - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message || 'Error obteniendo movimientos');
    }

    return data || [];
  }
};