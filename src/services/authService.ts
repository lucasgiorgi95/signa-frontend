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

    // Obtener datos adicionales del usuario desde la tabla users por email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.user.email)
      .single();

    if (userError) {
      console.warn('No se pudieron obtener datos adicionales del usuario:', userError);
    }

    const user: User = {
      id: userData?.id || 0, // Usar el ID de la tabla users
      email: data.user.email!,
      username: userData?.username || data.user.email!.split('@')[0],
      is_active: userData?.is_active ?? true,
      created_at: userData?.created_at || data.user.created_at,
      updated_at: userData?.updated_at || data.user.created_at,
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
    // Nota: Tu esquema usa INTEGER IDs, no UUIDs, así que omitimos el ID
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        username: userData.username,
        password: 'managed_by_supabase_auth', // Placeholder ya que Supabase Auth maneja las contraseñas
      });

    if (insertError) {
      console.error('Error insertando datos del usuario:', insertError);
      console.error('Detalles del error:', JSON.stringify(insertError, null, 2));
      // No lanzamos error aquí porque el usuario ya fue creado en Auth
    }

    // Obtener el usuario recién creado de la tabla users
    const { data: newUserData } = await supabase
      .from('users')
      .select('*')
      .eq('email', userData.email)
      .single();

    const user: User = {
      id: newUserData?.id || 0,
      email: data.user.email!,
      username: userData.username,
      is_active: true,
      created_at: data.user.created_at!,
      updated_at: new Date().toISOString(),
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

    // Intentar obtener datos adicionales del usuario por email (ya que tu tabla usa INTEGER IDs)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.warn('Error obteniendo datos adicionales del usuario:', userError);
    }

    return {
      id: userData?.id || 0, // Usar el ID de la tabla users o 0 como fallback
      email: user.email!,
      username: userData?.username || user.email!.split('@')[0],
      is_active: userData?.is_active ?? true,
      created_at: userData?.created_at || user.created_at!,
      updated_at: userData?.updated_at || user.created_at!,
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