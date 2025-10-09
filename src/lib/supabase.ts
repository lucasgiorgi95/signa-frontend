import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para las tablas de Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          code: string
          name: string
          stock: number
          min_stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          stock?: number
          min_stock?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          stock?: number
          min_stock?: number
          created_at?: string
          updated_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          product_id: string
          user_id: string
          type: 'entrada' | 'salida' | 'ajuste'
          quantity: number
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          type: 'entrada' | 'salida' | 'ajuste'
          quantity: number
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          type?: 'entrada' | 'salida' | 'ajuste'
          quantity?: number
          reason?: string | null
          created_at?: string
        }
      }
    }
  }
}