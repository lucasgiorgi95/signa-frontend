import apiClient from './axios';
import { User, LoginCredentials, RegisterData, AuthToken } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await apiClient.post('/auth/login', credentials);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error en el login');
    }
    
    const { user, token } = response.data.data;
    
    console.log('💾 Guardando token:', token ? `${token.substring(0, 20)}...` : 'No token');
    console.log('👤 Guardando usuario:', user);
    
    // Guardar token
    localStorage.setItem('auth_token', token);
    
    // Guardar datos del usuario
    localStorage.setItem('user_data', JSON.stringify(user));
    
    // Verificar que se guardó correctamente
    const savedToken = localStorage.getItem('auth_token');
    console.log('✅ Token guardado verificado:', savedToken ? `${savedToken.substring(0, 20)}...` : 'No se guardó');
    
    return { user, token };
  },

  async register(userData: RegisterData): Promise<User> {
    console.log('🔍 Enviando datos de registro:', userData);
    
    const response = await apiClient.post('/auth/register', userData);
    
    console.log('📊 Respuesta del servidor:', response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error en el registro');
    }
    
    return response.data.data.user;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error obteniendo usuario');
    }
    
    return response.data.data;
  },

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
};