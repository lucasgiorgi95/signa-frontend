'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddBoxIcon from '@mui/icons-material/AddBox';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: <DashboardIcon fontSize="small" />,
    description: 'Resumen general'
  },
  { 
    name: 'Scanner', 
    href: '/scanner', 
    icon: <QrCodeScannerIcon fontSize="small" />,
    description: 'Escanear códigos'
  },
  { 
    name: 'Productos', 
    href: '/products', 
    icon: <InventoryIcon fontSize="small" />,
    description: 'Gestionar inventario'
  },
  { 
    name: 'Reportes', 
    href: '/reports', 
    icon: <AssessmentIcon fontSize="small" />,
    description: 'Generar reportes'
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  // No mostrar sidebar si no está autenticado
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Mobile menu button */}
      {!isMobileMenuOpen && (
        <div className="md:hidden fixed top-4 left-4 z-30">
          <button
            onClick={toggleMobileMenu}
            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/50 transition-all duration-200"
          >
            <span className="sr-only">Abrir menú principal</span>
            <MenuIcon fontSize="medium" />
          </button>
        </div>
      )}

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-20 bg-black/30 backdrop-blur-sm transition-opacity duration-300" 
          onClick={closeMobileMenu} 
        />
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white h-screen sticky top-0 border-r border-gray-200">
          <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center flex-shrink-0 px-4 mb-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <InventoryIcon className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Inventario</h1>
              </div>
            </div>

            {/* User Info */}
            <div className="px-4 mb-6">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <PersonIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href === '/products' && pathname.startsWith('/products'));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={`mr-3 transition-colors duration-200 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}>
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="px-2 pb-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200"
              >
                <LogoutIcon className="mr-3 h-4 w-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-y-0 left-0 z-25 w-64 bg-white/95 backdrop-blur-md border-r border-gray-200/50 shadow-2xl transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-all duration-300 ease-out`}>
        <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between flex-shrink-0 px-4 mb-5">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <InventoryIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Inventario</h1>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="sr-only">Cerrar menú</span>
              <CloseIcon fontSize="medium" />
            </button>
          </div>

          {/* Mobile User Info */}
          <div className="px-4 mb-6">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <PersonIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href === '/products' && pathname.startsWith('/products'));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={`mr-3 transition-colors duration-200 ${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}>
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Logout Button */}
          <div className="px-2 pb-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200"
            >
              <LogoutIcon className="mr-3 h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
