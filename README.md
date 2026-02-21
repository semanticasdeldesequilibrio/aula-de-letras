# Aula de Letras

Plataforma colaborativa para docentes de Lengua y Literatura de secundaria.

## Descripcion

Aula de Letras es una aplicacion web donde los docentes pueden:
- Compartir planes de clase y actividades
- Explorar recursos por ano escolar (1ro a 5to) y tema
- Valorar y comentar los aportes de otros docentes
- Conectar con colegas mediante perfiles y mensajes
- Guardar planes favoritos para acceder facilmente

## Tecnologias

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- TipTap (editor de texto enriquecido)
- Lucide React (iconos)

### Backend
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT para autenticacion
- Cloudinary para almacenamiento de archivos

## Instalacion

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- Cuenta en Cloudinary (para archivos)

### Pasos

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd aula-de-letras
```

2. **Configurar el Backend**
```bash
cd server
npm install

# Copiar archivo de configuracion
cp .env.example .env
# Editar .env con tus credenciales

# Generar cliente Prisma
npm run db:generate

# Crear tablas en la base de datos
npm run db:push

# Poblar datos iniciales (temas y admin)
npm run db:seed
```

3. **Configurar el Frontend**
```bash
cd client
npm install
```

### Variables de Entorno (server/.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/aula_de_letras"
JWT_SECRET="tu-clave-secreta"
JWT_EXPIRES_IN="7d"
PORT=5000
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
FRONTEND_URL="http://localhost:3000"
```

## Ejecutar el Proyecto

### Desarrollo

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

La aplicacion estara disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Usuario Admin por Defecto
- Email: admin@auladeletras.com
- Password: admin123

## Estructura del Proyecto

```
aula-de-letras/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Paginas de la app
│   │   ├── context/        # Context API (auth)
│   │   ├── services/       # Llamadas a API
│   │   └── styles/         # Estilos globales
│   └── ...
│
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── controllers/    # Logica de endpoints
│   │   ├── routes/         # Definicion de rutas
│   │   ├── middleware/     # Auth, validation
│   │   └── config/         # Database, cloudinary
│   └── prisma/
│       ├── schema.prisma   # Esquema de BD
│       └── seed.js         # Datos iniciales
│
└── README.md
```

## Funcionalidades Principales

### Usuarios
- Registro e inicio de sesion
- Perfiles con bio e institucion
- Sistema de seguidores
- Mensajeria privada

### Planes de Clase
- CRUD completo
- Editor de texto enriquecido
- Archivos adjuntos (PDF, Word, imagenes)
- Organizacion por ano y tema
- Busqueda y filtros avanzados

### Valoraciones y Comunidad
- Sistema de estrellas (1-5)
- Comentarios en planes
- Favoritos
- Feed de actividad

### Moderacion
- Panel de administracion
- Aprobacion de planes (usuarios nuevos)
- Sistema de reportes

## API Endpoints

### Autenticacion
- `POST /api/auth/registro` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesion
- `GET /api/auth/perfil` - Obtener perfil actual

### Planes
- `GET /api/planes` - Listar planes con filtros
- `GET /api/planes/:id` - Obtener plan
- `POST /api/planes` - Crear plan
- `PUT /api/planes/:id` - Actualizar plan
- `DELETE /api/planes/:id` - Eliminar plan

### Usuarios
- `GET /api/usuarios/:id` - Perfil de usuario
- `POST /api/usuarios/:id/seguir` - Seguir usuario
- `GET /api/feed` - Feed de actividad

## Licencia

MIT License
