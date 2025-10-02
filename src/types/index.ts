// Tipos existentes para marcas
export interface Brand {
  id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandFormData {
  name: string;
  description: string;
  owner: string;
}

// Tipos para autenticación
export interface User {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
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
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  user_id: string;
  created_at: string;
}

export interface SupplierCreate {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface SupplierUpdate {
  name?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
}

// Tipos para productos
export interface Product {
  id: string;
  code: string;
  name: string;
  current_stock: number;
  min_stock: number;
  supplier_id?: string;
  supplier_name?: string;
  user_id: string;
  created_at: string;
}

export interface ProductCreate {
  code: string;
  name: string;
  current_stock: number;
  min_stock: number;
  supplier_id?: string;
}

export interface ProductUpdate {
  code?: string;
  name?: string;
  current_stock?: number;
  min_stock?: number;
  supplier_id?: string;
}

// Tipos para movimientos de stock
export enum MovementType {
  IN = "IN",
  OUT = "OUT",
  ADJUST = "ADJUST"
}

export interface StockMovement {
  id: string;
  product_id: string;
  type: MovementType;
  quantity: number;
  reason?: string;
  user_id: string;
  created_at: string;
}

export interface StockMovementCreate {
  product_id: string;
  type: MovementType;
  quantity: number;
  reason?: string;
}

export interface StockAdjust {
  product_id: string;
  quantity: number;
  type: MovementType;
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
