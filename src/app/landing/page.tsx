'use client';

import Link from 'next/link';
import { useState } from 'react';
import InventoryIcon from '@mui/icons-material/Inventory';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <QrCodeScannerIcon className="h-8 w-8" />,
      title: "Scanner con Cámara",
      description: "Escanea códigos de barras con tu cámara y gestiona stock al instante"
    },
    {
      icon: <InventoryIcon className="h-8 w-8" />,
      title: "Control de Stock",
      description: "Monitorea inventario en tiempo real con alertas automáticas"
    },
    {
      icon: <AssessmentIcon className="h-8 w-8" />,
      title: "Reportes Profesionales",
      description: "Exporta reportes en PDF y Excel para análisis y auditorías"
    },
    {
      icon: <BusinessIcon className="h-8 w-8" />,
      title: "Gestión de Proveedores",
      description: "Organiza proveedores y facilita la reposición de productos"
    }
  ];

  const testimonials = [
    {
      name: "María González",
      business: "Farmacia San José",
      text: "Redujo el tiempo de inventario de 4 horas a 30 minutos. ¡Increíble!",
      rating: 5
    },
    {
      name: "Carlos Ruiz",
      business: "Almacén Central",
      text: "El scanner con cámara es súper rápido. Ya no perdemos productos.",
      rating: 5
    },
    {
      name: "Ana Martín",
      business: "Tienda Moda",
      text: "Los reportes me ayudan a tomar mejores decisiones de compra.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <InventoryIcon className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Control de Inventario
              <span className="block text-yellow-300">Inteligente</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Gestiona tu stock con scanner de cámara, reportes automáticos y alertas inteligentes. 
              <span className="font-semibold text-white">¡Pruébalo gratis ahora!</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200 shadow-2xl"
              >
                <PlayArrowIcon className="h-6 w-6 mr-2" />
                Probar Demo Gratis
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Crear Cuenta Real
              </Link>
            </div>
            
            <p className="text-blue-200 text-sm mt-4">
              ✅ Demo: demo / 123456 • ✅ Setup en 2 minutos • ✅ Datos reales
            </p>
            
            <p className="text-blue-200 text-sm mt-4">
              ✅ Sin tarjeta de crédito • ✅ Setup en 2 minutos • ✅ Soporte incluido
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para tu inventario
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Funcionalidades profesionales diseñadas para pequeñas y medianas empresas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Preview */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ve cómo funciona en acción
            </h2>
            <p className="text-xl text-gray-600">
              Scanner con cámara + Control de stock + Reportes automáticos
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  🎯 Perfecto para:
                </h3>
                <div className="space-y-4">
                  {[
                    "🏪 Tiendas y comercios",
                    "💊 Farmacias",
                    "🍕 Restaurantes",
                    "📦 Almacenes",
                    "🔧 Talleres",
                    "👕 Boutiques"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="text-center">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <QrCodeScannerIcon className="h-24 w-24 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Scanner en Tiempo Real
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Apunta, escanea y gestiona stock al instante
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                  >
                    Probar Ahora
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-gray-300">
              Más de 1,000 negocios ya confían en nosotros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para revolucionar tu inventario?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de negocios que ya optimizaron su gestión de stock
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200"
            >
              <PlayArrowIcon className="h-6 w-6 mr-2" />
              Probar Demo Gratis
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
            >
              Crear Cuenta Real
            </Link>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-blue-100 text-sm">
              💡 Usa <span className="font-semibold">demo</span> / <span className="font-semibold">123456</span> para probar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}