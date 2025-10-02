'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InventoryIcon from '@mui/icons-material/Inventory';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function DemoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const demoFeatures = [
    {
      icon: <QrCodeScannerIcon className="h-6 w-6" />,
      title: "Scanner con Cámara",
      description: "Prueba escanear códigos reales",
      action: "Escanear Ahora"
    },
    {
      icon: <InventoryIcon className="h-6 w-6" />,
      title: "Productos Pre-cargados",
      description: "Ve 50+ productos de ejemplo",
      action: "Ver Productos"
    },
    {
      icon: <AssessmentIcon className="h-6 w-6" />,
      title: "Reportes Reales",
      description: "Descarga reportes de muestra",
      action: "Generar Reporte"
    },
    {
      icon: <BusinessIcon className="h-6 w-6" />,
      title: "Proveedores Demo",
      description: "Gestiona proveedores ficticios",
      action: "Ver Proveedores"
    }
  ];

  const handleStartDemo = async () => {
    setIsLoading(true);
    
    // Simular creación de sesión demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Crear usuario demo en localStorage
    const demoUser = {
      id: 'demo-user',
      username: 'demo',
      email: 'demo@inventario.com',
      is_active: true,
      created_at: new Date().toISOString()
    };
    
    const demoToken = 'demo-token-' + Date.now();
    
    localStorage.setItem('auth_token', demoToken);
    localStorage.setItem('user_data', JSON.stringify(demoUser));
    localStorage.setItem('demo_mode', 'true');
    
    // Redirigir al dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <PlayArrowIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demo Interactivo
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Prueba todas las funcionalidades sin registrarte. 
            <span className="font-semibold text-blue-600"> ¡100% funcional!</span>
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">
                Demo con datos reales • Sin límites • Sin registro
              </span>
            </div>
          </div>
        </div>

        {/* Demo Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {demoFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {feature.description}
                  </p>
                  <span className="text-sm text-blue-600 font-medium">
                    → {feature.action}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Content Preview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ¿Qué incluye el demo?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Productos de ejemplo</div>
              <div className="text-sm text-gray-500 mt-1">Farmacia, tienda, almacén</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-gray-600">Movimientos de stock</div>
              <div className="text-sm text-gray-500 mt-1">Entradas, salidas, ajustes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
              <div className="text-gray-600">Proveedores ficticios</div>
              <div className="text-sm text-gray-500 mt-1">Con datos completos</div>
            </div>
          </div>
        </div>

        {/* Start Demo Button */}
        <div className="text-center">
          <button
            onClick={handleStartDemo}
            disabled={isLoading}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Preparando Demo...
              </>
            ) : (
              <>
                <PlayArrowIcon className="h-6 w-6 mr-3" />
                Iniciar Demo Gratis
              </>
            )}
          </button>
          
          <p className="text-gray-500 text-sm mt-4">
            El demo se ejecuta completamente en tu navegador
          </p>
          
          <div className="mt-6">
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ¿Prefieres crear una cuenta real? →
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            ✨ Después del demo podrás:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Crear tu cuenta real en 30 segundos</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Importar tus productos reales</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Usar el scanner con tus códigos</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Generar reportes de tu inventario</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}