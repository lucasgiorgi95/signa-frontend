# Sistema de Inventario - Frontend

Frontend desarrollado con Next.js 15 para el sistema de gestión de inventario con códigos de barras.

## 🚀 Características

### Autenticación
- ✅ Registro e inicio de sesión
- ✅ Autenticación JWT con persistencia
- ✅ Protección de rutas automática
- ✅ Logout desde sidebar

### Dashboard
- ✅ Métricas en tiempo real (total productos, stock bajo, sin stock)
- ✅ Botón de escaneo prominente
- ✅ Lista de productos con stock crítico
- ✅ Acciones rápidas

### Gestión de Productos
- ✅ Lista completa con búsqueda y filtros
- ✅ Crear, editar y eliminar productos
- ✅ Búsqueda por código de barras
- ✅ Alertas de stock bajo/agotado

### Scanner de Códigos
- ✅ Búsqueda manual por código
- ✅ Integración con creación de productos
- ✅ Redirección automática a ajuste de stock
- 🔄 Cámara (próximamente)

### Control de Stock
- ✅ Ajustes rápidos (+1, +5, +10, -1, -5, -10)
- ✅ Formulario de ajuste manual
- ✅ Validaciones de stock negativo
- ✅ Historial completo de movimientos

### Historial
- ✅ Todos los movimientos con filtros avanzados
- ✅ Historial específico por producto
- ✅ Estadísticas y resúmenes

## 🛠️ Tecnologías

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Material-UI Icons** - Iconografía
- **Axios** - Cliente HTTP
- **Context API** - Manejo de estado

## 📦 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone [tu-repo]
   cd signa-prueba
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## 🔧 Configuración del Backend

**Importante:** El frontend requiere que el backend esté corriendo.

1. **Iniciar el backend:**
   ```bash
   cd ../signa-backend
   python run.py
   ```

2. **Verificar conexión:**
   ```bash
   node test-connection.js
   ```

## 📱 Páginas Implementadas

### Autenticación
- `/login` - Iniciar sesión
- `/register` - Crear cuenta

### Aplicación Principal
- `/dashboard` - Panel principal con métricas
- `/scanner` - Escáner de códigos de barras
- `/products` - Lista de productos
- `/products/new` - Crear producto
- `/products/[id]/edit` - Editar producto
- `/products/[id]/adjust` - Ajustar stock
- `/movements` - Historial de movimientos
- `/movements/product/[id]` - Historial por producto

## 🎯 Flujos de Usuario

### 1. Primer Uso
1. Registrarse en `/register`
2. Iniciar sesión automático
3. Ir al dashboard
4. Crear primer producto
5. Realizar ajustes de stock

### 2. Uso Diario
1. Login → Dashboard
2. Escanear código → Ajustar stock
3. Ver productos con stock bajo
4. Reponer inventario

### 3. Gestión Avanzada
1. Ver historial completo
2. Filtrar movimientos
3. Analizar tendencias
4. Gestionar productos

## 🔐 Autenticación

El sistema usa JWT tokens que se almacenan en `localStorage`:
- **Token**: `auth_token`
- **Usuario**: `user_data`

### Interceptores Axios
- **Request**: Agrega token automáticamente
- **Response**: Maneja 401 y logout automático

## 📊 Estructura de Componentes

```
src/
├── app/                    # Páginas (App Router)
├── components/            # Componentes reutilizables
├── context/              # Context providers
├── hooks/                # Custom hooks
├── services/             # Servicios API
└── types/                # Definiciones TypeScript
```

### Hooks Principales
- `useAuth()` - Autenticación
- `useProducts()` - Gestión de productos
- `useStock()` - Operaciones de stock

### Servicios API
- `authService` - Login, registro, usuario actual
- `productService` - CRUD productos, búsqueda
- `stockService` - Ajustes, dashboard
- `movementService` - Historial de movimientos

## 🎨 Diseño

### Sidebar Inteligente
- Solo visible cuando está autenticado
- Navegación completa del sistema
- Información del usuario
- Logout integrado

### Estados de UI
- ✅ Loading states en todas las operaciones
- ✅ Empty states cuando no hay datos
- ✅ Error handling con mensajes claros
- ✅ Feedback visual inmediato

### Responsive
- ✅ Mobile-first design
- ✅ Sidebar colapsible en móvil
- ✅ Tablas responsivas
- ✅ Formularios adaptables

## 🧪 Testing

### Probar Conexión Backend
```bash
node test-connection.js
```

### Flujo de Prueba Manual
1. Registrar usuario
2. Crear producto
3. Escanear código
4. Ajustar stock
5. Ver historial

## 🚀 Despliegue

### Variables de Producción
```env
NEXT_PUBLIC_API_URL=https://tu-backend.com/api/v1
NEXT_PUBLIC_ENV=production
```

### Build
```bash
npm run build
npm start
```

## 📝 Notas de Desarrollo

### Próximas Características
- [ ] Cámara para scanner
- [ ] Exportar reportes
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Múltiples almacenes

### Consideraciones
- El sistema está optimizado para uso móvil
- Todas las operaciones son en tiempo real
- Los datos se sincronizan automáticamente
- La autenticación persiste entre sesiones

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.