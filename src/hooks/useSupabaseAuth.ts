import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error obteniendo sesión inicial:', error);
          setUser(null);
        } else if (session?.user) {
          // Crear usuario básico con datos de la sesión
          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            username: session.user.email!.split('@')[0],
            created_at: session.user.created_at!,
            updated_at: session.user.updated_at || session.user.created_at!,
          };
          
          setUser(userData);
          console.log('✅ Sesión restaurada:', userData.email);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error en getInitialSession:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email);
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            username: session.user.email!.split('@')[0],
            created_at: session.user.created_at!,
            updated_at: session.user.updated_at || session.user.created_at!,
          };
          
          setUser(userData);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}