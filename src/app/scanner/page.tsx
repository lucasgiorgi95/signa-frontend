'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { BrowserMultiFormatReader } from '@zxing/browser';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import StopIcon from '@mui/icons-material/Stop';

export default function ScannerPage() {
  const router = useRouter();
  const { searchByCode, loading } = useProducts();
  
  const [manualCode, setManualCode] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<any>(null);

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    setIsSearching(true);
    setError(null);
    setSearchResult(null);

    try {
      const product = await searchByCode(manualCode.trim());
      if (product) {
        setSearchResult(product);
      } else {
        setSearchResult(null);
        setError('Producto no encontrado');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error buscando producto');
    } finally {
      setIsSearching(false);
    }
  };

  // Inicializar el lector de códigos
  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    
    return () => {
      // Cleanup: stop any ongoing decoding
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const startScanning = async () => {
    if (!codeReaderRef.current || !videoRef.current) return;
    
    setIsScanning(true);
    setCameraError(null);
    setError(null);
    
    try {
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        setCameraError('No se encontraron cámaras disponibles');
        setIsScanning(false);
        return;
      }

      // Usar la primera cámara disponible (o la trasera si está disponible)
      const selectedDeviceId = videoInputDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      )?.deviceId || videoInputDevices[0].deviceId;

      const controls = await codeReaderRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            const code = result.getText();
            handleCodeScanned(code);
          }
        }
      );
      
      controlsRef.current = controls;
    } catch (err) {
      console.error('Error starting camera:', err);
      setCameraError('Error al acceder a la cámara. Verifica los permisos.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    
    // Also stop the video stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  const handleCodeScanned = async (code: string) => {
    setManualCode(code);
    stopScanning();
    
    setIsSearching(true);
    setError(null);
    setSearchResult(null);

    try {
      const product = await searchByCode(code.trim());
      if (product) {
        setSearchResult(product);
      } else {
        setSearchResult(null);
        setError('Producto no encontrado');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error buscando producto');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateProduct = () => {
    const code = manualCode.trim();
    if (code) {
      router.push(`/products/new?code=${encodeURIComponent(code)}`);
    } else {
      router.push('/products/new');
    }
  };

  const handleAdjustStock = () => {
    if (searchResult) {
      router.push(`/products/${searchResult.id}/adjust`);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <QrCodeScannerIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Scanner de Códigos</h1>
            <p className="mt-2 text-gray-600">Escanea o ingresa manualmente el código de barras</p>
          </div>

          {/* Scanner con Cámara */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Escáner de Cámara</h3>
              <p className="text-gray-500">
                {isScanning ? 'Apunta la cámara hacia el código de barras' : 'Activa la cámara para escanear códigos automáticamente'}
              </p>
            </div>
            
            <div className="relative">
              {/* Video Element */}
              <div className={`relative rounded-lg overflow-hidden ${isScanning ? 'block' : 'hidden'}`}>
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover bg-black"
                  playsInline
                  muted
                />
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-red-500 rounded-lg"></div>
                </div>
              </div>

              {/* Placeholder cuando no está escaneando */}
              {!isScanning && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <QrCodeScannerIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">
                    Presiona el botón para activar la cámara
                  </p>
                </div>
              )}

              {/* Error de cámara */}
              {cameraError && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  <div className="flex items-center">
                    <CameraAltIcon className="h-5 w-5 mr-2" />
                    {cameraError}
                  </div>
                </div>
              )}
            </div>

            {/* Controles de Cámara */}
            <div className="mt-4 flex justify-center space-x-4">
              {!isScanning ? (
                <button
                  onClick={startScanning}
                  disabled={isSearching}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <CameraAltIcon className="h-5 w-5 mr-2" />
                  Activar Cámara
                </button>
              ) : (
                <button
                  onClick={stopScanning}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <StopIcon className="h-5 w-5 mr-2" />
                  Detener Escáner
                </button>
              )}
            </div>
          </div>

          {/* Búsqueda Manual */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Búsqueda Manual</h2>
            
            <form onSubmit={handleManualSearch} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Barras
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    id="code"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Ingresa el código de barras..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isSearching || !manualCode.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Buscando...
                      </>
                    ) : (
                      <>
                        <SearchIcon className="h-4 w-4 mr-2" />
                        Buscar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Resultado de Búsqueda */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-red-800">Producto no encontrado</h3>
                  <p className="text-sm text-red-700 mt-1">
                    No se encontró un producto con el código "{manualCode}"
                  </p>
                </div>
                <button
                  onClick={handleCreateProduct}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  <AddIcon className="h-4 w-4 mr-1" />
                  Crear Producto
                </button>
              </div>
            </div>
          )}

          {searchResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <InventoryIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-green-900">{searchResult.name}</h3>
                    <p className="text-sm text-green-700">Código: {searchResult.code}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-sm text-green-700">
                        Stock actual: <span className="font-medium">{searchResult.current_stock}</span>
                      </span>
                      <span className="text-sm text-green-700">
                        Stock mínimo: <span className="font-medium">{searchResult.min_stock}</span>
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        searchResult.current_stock === 0
                          ? 'bg-red-100 text-red-800'
                          : searchResult.current_stock <= searchResult.min_stock
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {searchResult.current_stock === 0
                          ? 'Sin stock'
                          : searchResult.current_stock <= searchResult.min_stock
                          ? 'Stock bajo'
                          : 'En stock'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleAdjustStock}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Ajustar Stock
                </button>
              </div>
            </div>
          )}

          {/* Acciones Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/products"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <InventoryIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Ver Productos</h3>
                  <p className="text-sm text-gray-500">Gestionar inventario completo</p>
                </div>
              </div>
            </Link>

            <Link
              href="/products/new"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AddIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Nuevo Producto</h3>
                  <p className="text-sm text-gray-500">Agregar al inventario</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Instrucciones */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">📱 Cómo usar el scanner</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>1. Ingresa manualmente el código de barras en el campo de búsqueda</li>
              <li>2. Si el producto existe, podrás ajustar su stock directamente</li>
              <li>3. Si no existe, podrás crear un nuevo producto con ese código</li>
              <li>4. La funcionalidad de cámara se agregará en futuras versiones</li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}