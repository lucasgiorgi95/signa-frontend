// Types cleaned up - removed unused brand types

// Tipos para autenticación
export interface User {
  id: number;
  email: string;
  username: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

// Tipos para proveedores
export interface Supplier {
  id: string;
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierCreate {
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface SupplierUpdate {
  name?: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
}

// Tipos para productos
export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  stock: number;
  min_stock: number;
  price?: number;
  image_url?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  code: string;
  name: string;
  stock?: number;
  min_stock?: number;
}

export interface ProductUpdate {
  code?: string;
  name?: string;
  stock?: number;
  min_stock?: number;
}

// Tipos para movimientos de stock

export interface StockMovement {
  id: number;
  product_id: number;
  type: string; // "entrada" | "salida" | "ajuste"
  quantity: number;
  reason?: string;
  user_id: number;
  created_at: string;
}

export interface StockMovementCreate {
  product_id: number;
  type: string; // "entrada" | "salida" | "ajuste"
  quantity: number;
  reason?: string;
}

export interface StockAdjust {
  product_id: number;
  quantity: number;
  type: string; // "entrada" | "salida" | "ajuste"
  reason?: string;
}

// Tipos para dashboard
export interface DashboardData {
  total_products: number;
  low_stock_count: number;
  out_of_stock_count: number;
}

// Tipos para errores de API
export interface ApiError {
  detail: string;
}
