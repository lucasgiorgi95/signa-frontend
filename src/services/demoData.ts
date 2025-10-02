import { Product, Supplier, StockMovement, MovementType } from '@/types';

export const demoSuppliers: Supplier[] = [
  {
    id: 'supplier-1',
    name: 'Distribuidora Médica ABC',
    contact_person: 'Dr. Juan Pérez',
    phone: '+1 234 567 8900',
    email: 'contacto@medicaabc.com',
    address: 'Av. Principal 123, Ciudad',
    user_id: 'demo-user',
    created_at: new Date().toISOString()
  },
  {
    id: 'supplier-2',
    name: 'Alimentos Frescos SA',
    contact_person: 'María González',
    phone: '+1 234 567 8901',
    email: 'ventas@alimentosfrescos.com',
    address: 'Calle Comercio 456, Ciudad',
    user_id: 'demo-user',
    created_at: new Date().toISOString()
  },
  {
    id: 'supplier-3',
    name: 'Tecnología y Más',
    contact_person: 'Carlos Rodríguez',
    phone: '+1 234 567 8902',
    email: 'info@tecnologiaymas.com',
    address: 'Plaza Tech 789, Ciudad',
    user_id: 'demo-user',
    created_at: new Date().toISOString()
  }
];

export const demoProducts: Product[] = [
  // Farmacia
  {
    id: 'product-1',
    code: '7501234567890',
    name: 'Paracetamol 500mg x 20 tabletas',
    current_stock: 45,
    min_stock: 10,
    supplier_id: 'supplier-1',
    supplier_name: 'Distribuidora Médica ABC',
    user_id: 'demo-user',
    created_at: new Date().toISOString()
  },
  {
    id: 'product-2',
    code: '7501234567891',
    name: 'Ibuprofeno 400mg x 30 cápsulas',
    current_stock: 8,
    min_stock: 15,
    supplier_id: 'supplier-1',
    supplier_name: 'Distribuidora Médica ABC',
    user_id: 'demo-user',
    created_at: new Date().toISOString()
  },
  {
    id: 'product-3',
    code: '7501234567892',
    name: 'Vitamina C 1000mg x 60 tabletas',
    current_stock: 0,
    min_stock: 5,
    supplier_id: 'supplier-1',
    supplier_name: 'Distribuidora Médica ABC',
    user_id: 'demo-user',
    created_at: new Date().toISOString()
  },
  
  // Tienda de comida
  {
    id: 'product-4',
    code: '7501234567893',
    name: 'Coca Cola 600ml',
    current_stock: 120,
    min_stock: 24,
    supplier_id: 'supplier-2',
    supplier_name: 'Alimentos Frescos SA',
    user_id: 'demo-user',
    created_at: new Date().toISOString()
  },
  {
    id: 'product-5',
    code: '7501234567894',
    name: 'Pan Integral Bimbo',
    current_stock: 15,
    min_stock: 20,
    supplier_id: 'supplier-2',
    supplier_name: 'Alimentos Frescos SA',
    user_id: 'demo-user',
    created_at: new Date().toISOString()
  },
  {
    id: 'product-6',
    code: '7501234567895',
    name: 'Leche Entera 1L',
    current_stock: 35,
    min_stock: 12,
    supplier_id: 'supplier-2',
    supplier_name: 'Alimentos Frescos SA',
    user_id: 'demo-user',
    created_at: new Date().toISOString()
  },
  
  // Tecnología
  {
    id: 'product-7',
    code: '7501234567896',
    name: 'Cable USB-C 2m',
    current_stock: 25,
    min_stock: 10,
    supplier_id: 'supplier-3',
    supplier_name: 'Tecnología y Más',
    user_id: 'demo-user',
    created_at: new Date().toISOString()
  },
  {
    id: 'product-8',
    code: '7501234567897',
    name: 'Cargador iPhone Original',
    current_stock: 3,
    min_stock: 8,
    supplier_id: 'supplier-3',
    supplier_name: 'Tecnología y Más',
    user_id: 'demo-user',
    created_at: new Date().toISOString()
  },
  {
    id: 'product-9',
    code: '7501234567898',
    name: 'Auriculares Bluetooth',
    current_stock: 12,
    min_stock: 5,
    supplier_id: 'supplier-3',
    supplier_name: 'Tecnología y Más',
    user_id: 'demo-user',
    created_at: new Date().toISOString()
  },
  {
    id: 'product-10',
    code: '7501234567899',
    name: 'Mouse Inalámbrico',
    current_stock: 18,
    min_stock: 6,
    supplier_id: 'supplier-3',
    supplier_name: 'Tecnología y Más',
    user_id: 'demo-user',
    created_at: new Date().toISOString()
  }
];

export const demoMovements: StockMovement[] = [
  {
    id: 'movement-1',
    product_id: 'product-1',
    type: MovementType.IN,
    quantity: 50,
    reason: 'Compra inicial de inventario',
    user_id: 'demo-user',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'movement-2',
    product_id: 'product-1',
    type: MovementType.OUT,
    quantity: 5,
    reason: 'Venta a cliente',
    user_id: 'demo-user',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'movement-3',
    product_id: 'product-2',
    type: MovementType.IN,
    quantity: 30,
    reason: 'Reposición de stock',
    user_id: 'demo-user',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'movement-4',
    product_id: 'product-2',
    type: MovementType.OUT,
    quantity: 22,
    reason: 'Ventas múltiples',
    user_id: 'demo-user',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'movement-5',
    product_id: 'product-4',
    type: MovementType.IN,
    quantity: 144,
    reason: 'Pedido semanal',
    user_id: 'demo-user',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'movement-6',
    product_id: 'product-4',
    type: MovementType.OUT,
    quantity: 24,
    reason: 'Ventas del día',
    user_id: 'demo-user',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

export const initializeDemoData = () => {
  // Guardar datos demo en localStorage
  localStorage.setItem('demo_suppliers', JSON.stringify(demoSuppliers));
  localStorage.setItem('demo_products', JSON.stringify(demoProducts));
  localStorage.setItem('demo_movements', JSON.stringify(demoMovements));
};

export const getDemoData = () => {
  const suppliers = JSON.parse(localStorage.getItem('demo_suppliers') || '[]');
  const products = JSON.parse(localStorage.getItem('demo_products') || '[]');
  const movements = JSON.parse(localStorage.getItem('demo_movements') || '[]');
  
  return { suppliers, products, movements };
};

export const isDemoMode = () => {
  return localStorage.getItem('demo_mode') === 'true';
};