'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
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
    const initAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        const token = authService.getStoredToken();
        
        if (storedUser && token) {
          // Verificar que el token siga siendo válido
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            // Token inválido, limpiar datos
            authService.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
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
        username: userData.username,
        password: userData.password
      });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
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