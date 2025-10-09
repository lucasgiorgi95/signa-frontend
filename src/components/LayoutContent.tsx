'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Sidebar from './sidebar';

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const pathname = usePathname();

  // Rutas públicas que no necesitan autenticación
  const publicRoutes = ['/login', '/register', '/'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Debug logs
  console.log('LayoutContent - pathname:', pathname, 'isAuthenticated:', isAuthenticated, 'loading:', loading, 'user:', user?.email);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si es una ruta pública, mostrar layout simple sin sidebar
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-white">
        <main className="h-full">
          {children}
        </main>
      </div>
    );
  }

  // Si no está autenticado y no es ruta pública, mostrar layout simple
  // (ProtectedRoute se encargará de redirigir)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <main className="h-full">
          {children}
        </main>
      </div>
    );
  }

  // Layout con sidebar para páginas autenticadas
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-white">
        <main className="h-full bg-white">
          <div className="p-0 pt-20 md:pt-0 bg-white min-h-screen">
            <div className="w-full max-w-none">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}