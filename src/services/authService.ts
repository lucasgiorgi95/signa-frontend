import { supabase } from '@/lib/supabase';
import { User, LoginCredentials, RegisterData } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message || 'Error en el login');
    }

    if (!data.user) {
      throw new Error('No se pudo obtener el usuario');
    }

    // Obtener datos adicionales del usuario desde la tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.warn('No se pudieron obtener datos adicionales del usuario:', userError);
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      username: userData?.username || data.user.email!.split('@')[0],
      createdAt: data.user.created_at,
      updatedAt: userData?.updated_at || data.user.created_at,
    };

    const token = data.session?.access_token || '';

    console.log('✅ Usuario autenticado:', user);
    
    return { user, token };
  },

  async register(userData: RegisterData): Promise<User> {
    console.log('🔍 Registrando usuario:', userData);
    
    // Registrar en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      console.error('❌ Error detallado de Supabase:', error);
      
      // Mensajes de error más específicos
      if (error.message.includes('email_address_invalid')) {
        throw new Error('El email no es válido. Verifica la configuración de Supabase Auth.');
      } else if (error.message.includes('signup_disabled')) {
        throw new Error('El registro está deshabilitado. Contacta al administrador.');
      } else if (error.message.includes('email_not_confirmed')) {
        throw new Error('Debes confirmar tu email antes de continuar.');
      }
      
      throw new Error(error.message || 'Error en el registro');
    }

    if (!data.user) {
      throw new Error('No se pudo crear el usuario');
    }

    // Insertar datos adicionales en la tabla users
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: userData.email,
        username: userData.username,
      });

    if (insertError) {
      console.error('Error insertando datos del usuario:', insertError);
      // No lanzamos error aquí porque el usuario ya fue creado en Auth
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      username: userData.username,
      createdAt: data.user.created_at!,
      updatedAt: new Date().toISOString(),
    };

    console.log('✅ Usuario registrado:', user);
    
    return user;
  },

  async getCurrentUser(): Promise<User> {
    // Primero verificar si hay una sesión válida
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      throw new Error('No hay sesión activa');
    }

    const user = session.user;

    // Intentar obtener datos adicionales del usuario
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      // PGRST116 = No rows returned, es normal si el usuario no está en la tabla users
      console.warn('Error obteniendo datos adicionales del usuario:', userError);
    }

    return {
      id: user.id,
      email: user.email!,
      username: userData?.username || user.email!.split('@')[0],
      createdAt: user.created_at!,
      updatedAt: userData?.updated_at || user.created_at!,
    };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },

  async getStoredToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  },

  async getStoredUser(): Promise<User | null> {
    try {
      return await this.getCurrentUser();
    } catch {
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }
};