'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
  { name: 'Crea una nueva marca', href: '/brands/new', icon: <AddBoxIcon fontSize="small" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-indigo-600">Brand Manager</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={`mr-3 transition-colors duration-200 ${
                      isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-y-0 left-0 z-25 w-64 bg-white/95 backdrop-blur-md border-r border-gray-200/50 shadow-2xl transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-all duration-300 ease-out`}>
        <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between flex-shrink-0 px-4 mb-5">
            <h1 className="text-xl font-bold text-indigo-600">Brand Manager</h1>
            <button
              onClick={closeMobileMenu}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="sr-only">Cerrar menú</span>
              <CloseIcon fontSize="medium" />
            </button>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={`mr-3 transition-colors duration-200 ${
                    isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
