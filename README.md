# Signa Frontend

Una app web simple para manejar marcas. Hecha con Next.js y TypeScript.

## Cómo empezar

Necesitas Node.js 18+ y ya.

1. Clona e instala:

```bash
git clone [tu-repo]
cd signa-prueba
npm install
```

2. Configura la API:
   Crea un `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

3. Ejecuta:

```bash
npm run dev
```

Ya tienes la app en `http://localhost:3000`

## Qué usa

- Next.js 15 con TypeScript
- Tailwind CSS para estilos
- Material-UI para componentes
- Fetch API para conectar con el backend

## Backend

Se conecta a una API hecha con FastAPI. Solo cambia la URL en `.env.local` para apuntar a tu backend desplegado.

Los endpoints que usa:

- `GET /marcas` - Ver todas las marcas
- `POST /marcas` - Crear marca nueva
- `GET /marcas/{id}` - Ver una marca
- `PUT /marcas/{id}` - Actualizar marca
- `DELETE /marcas/{id}` - Borrar marca

## Estructura

```
src/
├── app/         # Páginas
├── components/  # Componentes
├── context/     # Estado global
└── services/    # API calls
```

## Scripts

- `npm run dev` - Desarrollo
- `npm run build` - Build para producción
- `npm start` - Correr en producción

## Despliegue

Para subir a Vercel:

1. Conecta tu repo de GitHub
2. Configura `NEXT_PUBLIC_API_URL` con la URL de tu backend
3. Deploy

Ya está.
