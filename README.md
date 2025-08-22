# Signa - Frontend

Aplicación web desarrollada con Next.js 13+ (App Router) para la gestión de marcas comerciales.

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18.0.0 o superior
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd signa-prueba
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Configura las variables de entorno:
Crea un archivo `.env.local` en la raíz del proyecto con:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔧 Tecnologías Principales

- **Next.js 13+** - Framework de React para aplicaciones web
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework CSS utility-first
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP para las peticiones a la API
- **React Query** - Manejo de estado del servidor y caché
- **Heroicons** - Biblioteca de iconos
- **Framer Motion** - Animaciones

## 🌐 Conexión con el Backend

El frontend se conecta a un backend desarrollado con FastAPI. La URL base de la API se configura en las variables de entorno:
- `NEXT_PUBLIC_API_URL`: URL base de la API (ej: http://localhost:8000/api/v1)

### Endpoints principales:
- `GET /marcas` - Obtener lista de marcas
- `POST /marcas` - Crear nueva marca
- `GET /marcas/{id}` - Obtener detalles de una marca
- `PUT /marcas/{id}` - Actualizar una marca
- `DELETE /marcas/{id}` - Eliminar una marca

## 🛠️ Estructura del Proyecto

```
src/
├── app/                    # Rutas de la aplicación
├── components/             # Componentes reutilizables
├── context/                # Contextos de React
├── hooks/                  # Custom hooks
├── lib/                    # Utilidades y configuraciones
├── services/               # Servicios API
├── styles/                 # Estilos globales
└── types/                  # Definiciones de TypeScript
```

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia la aplicación en producción
- `npm run lint` - Ejecuta el linter
- `npm run test` - Ejecuta las pruebas

## 🌍 Despliegue

### Vercel
La forma más sencilla de desplegar la aplicación es usando [Vercel](https://vercel.com):

1. Haz push de tu código a un repositorio de GitHub, GitLab o Bitbucket
2. Importa el proyecto en Vercel
3. Configura las variables de entorno
4. ¡Listo! Tu aplicación estará desplegada

### Variables de entorno de producción
Asegúrate de configurar las siguientes variables en producción:
```
NEXT_PUBLIC_API_URL=[URL_DEL_BACKEND_PRODUCCION]
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
# signa-frontend
