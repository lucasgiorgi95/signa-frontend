import apiClient from './axios';
import { User, LoginCredentials, RegisterData, AuthToken } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<AuthToken>('/auth/login', credentials);
    const { access_token } = response.data;
    
    // Guardar token
    localStorage.setItem('auth_token', access_token);
    
    // Obtener datos del usuario
    const userResponse = await apiClient.get<User>('/auth/me');
    const user = userResponse.data;
    
    // Guardar datos del usuario
    localStorage.setItem('user_data', JSON.stringify(user));
    
    return { user, token: access_token };
  },

  async register(userData: RegisterData): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', userData);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
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