'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '@/types';
import { authService } from '@/services/authService';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un usuario autenticado al cargar
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            username: session.user.email!.split('@')[0],
            createdAt: session.user.created_at!,
            updatedAt: session.user.updated_at || session.user.created_at!,
          };
          
          setUser(userData);
          console.log('✅ Sesión inicial restaurada:', userData.email);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 Auth state change:', event, session?.user?.email);
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            username: session.user.email!.split('@')[0],
            createdAt: session.user.created_at!,
            updatedAt: session.user.updated_at || session.user.created_at!,
          };
          
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const { user: loggedUser } = await authService.login(credentials);
      setUser(loggedUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      await authService.register(userData);
      // Después del registro, hacer login automático
      await login({
        email: userData.email,
        password: userData.password
      });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      // Forzar recarga para limpiar cualquier estado residual
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Incluso si hay error, limpiar el estado local
      setUser(null);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}