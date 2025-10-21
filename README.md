# Service Desk - Sistema de Gestión de Uniformes

Sistema completo de Service Desk para atención de problemas y gestión de tickets, desarrollado específicamente para el proyecto de gestión de uniformes escolares e industriales.

## 📋 Descripción

Este proyecto implementa un Service Desk basado en las mejores prácticas de ITIL v4, diseñado para gestionar incidentes, solicitudes de servicio y problemas relacionados con:

- **Gestión de Inventarios**: Control de materias primas y productos terminados
- **Portal de Clientes**: Plataforma web para catálogo y pedidos
- **Sistema de Pedidos**: Procesamiento y gestión de pedidos
- **Tracking de Producción**: Seguimiento en tiempo real del estado de producción
- **Catálogo de Productos**: Visualización de productos disponibles
- **Autenticación y Accesos**: Sistema de login y permisos

## 🚀 Características

### Funcionalidades Principales

1. **Ingreso de Tickets**
   - Formulario completo para reportar problemas o solicitudes
   - Categorización por servicio, prioridad y tipo
   - Información del usuario afectado
   - **Integración automática con GitLab Issues**

2. **Tablero de Seguimiento**
   - Vista tipo Kanban con tickets agrupados por estado
   - Filtros por estado, prioridad y servicio
   - Actualización en tiempo real

3. **Detalle de Tickets**
   - Vista completa de información del ticket
   - Sistema de comentarios con seguimiento
   - Comentarios internos para el equipo de soporte
   - Edición de estado, prioridad y asignación
   - **Comentarios sincronizados con GitLab**

4. **Integración GitLab**
   - Creación automática de issues en GitLab
   - Sincronización de comentarios
   - Labels automáticos por servicio y prioridad
   - Ver [INTEGRACION_GITLAB.md](INTEGRACION_GITLAB.md) para más detalles

### Categorización de Tickets

#### Prioridades
- **P1 - Crítico**: Impacto en operaciones principales (SLA: 2-4h)
- **P2 - Alto**: Impacto severo en procesos (SLA: 4-8h)
- **P3 - Medio**: Impacto parcial operativo (SLA: 8-24h)
- **P4 - Bajo**: Impacto mínimo o individual (SLA: 24-72h)

#### Niveles de Escalación
- **L1 - Service Desk**: Primera línea de atención
- **L2 - Equipo Técnico**: Soporte técnico especializado
- **L3 - Soporte Estratégico**: Especialistas avanzados
- **L4 - Gerencia**: Gestión de crisis empresariales

## 🛠️ Tecnologías

### Backend
- **Node.js** con Express
- **PostgreSQL** con Sequelize ORM
- **GitLab API** para gestión de issues
- **CORS** para comunicación frontend-backend
- API RESTful

### Frontend
- **React 18** con Vite
- **React Router** para navegación
- **Recharts** para visualización de datos
- **Lucide React** para iconos
- **date-fns** para manejo de fechas
- **Axios** para peticiones HTTP

## 📦 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- PostgreSQL (v12 o superior) - **Ver [CONFIGURACION_POSTGRESQL.md](CONFIGURACION_POSTGRESQL.md) para instalar**
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd service-desk
```

### 2. Configurar PostgreSQL

Ver guía completa en [CONFIGURACION_POSTGRESQL.md](CONFIGURACION_POSTGRESQL.md)

**Resumen rápido**:
```bash
# Instalar PostgreSQL y crear base de datos
psql -U postgres -c "CREATE DATABASE service_desk;"
```

### 3. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=service_desk
DB_USER=postgres
DB_PASSWORD=tu_password

# GitLab API
GITLAB_PROJECT_ID=75469260
GITLAB_TOKEN=tu_token_gitlab
```

**Nota**: Ver [INTEGRACION_GITLAB.md](INTEGRACION_GITLAB.md) para obtener el token de GitLab.

Inicializar base de datos y iniciar servidor:
```bash
npm run seed    # Crea tablas e inserta datos de ejemplo
npm run dev     # Inicia el servidor
```

### 4. Configurar Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env` en la carpeta `frontend` (opcional):
```env
VITE_API_URL=http://localhost:5000/api
```

Iniciar la aplicación:
```bash
npm run dev
```

## 🚀 Uso

1. **Iniciar PostgreSQL**
   ```bash
   # Windows - PostgreSQL ya debería estar corriendo como servicio
   # Si no, verificar:
   Get-Service postgresql*
   ```

2. **Iniciar Backend** (puerto 5000)
   ```bash
   cd backend
   npm run dev
   ```

3. **Inicializar datos (primera vez)**
   ```bash
   cd backend
   npm run seed
   ```

4. **Iniciar Frontend** (puerto 3000)
   ```bash
   cd frontend
   npm run dev
   ```

5. **Acceder a la aplicación**
   - Abrir navegador en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
service-desk/
├── backend/
│   ├── config/          # Configuración de BD
│   ├── controllers/     # Lógica de negocio
│   ├── models/          # Modelos de PostgreSQL
│   ├── routes/          # Rutas de la API
│   ├── services/        # Servicios (GitLab)
│   ├── scripts/         # Scripts de inicialización
│   ├── server.js        # Punto de entrada
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   │   ├── Layout/
│   │   │   ├── TicketCard/
│   │   │   └── CommentList/
│   │   ├── context/     # Context API
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Páginas principales
│   │   ├── services/    # API services
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md
├── INTEGRACION_GITLAB.md
└── CONFIGURACION_POSTGRESQL.md
```

## 🎯 Principios de Clean Code Aplicados

- **Nombres descriptivos**: Variables y funciones con nombres claros
- **Funciones pequeñas**: Cada función hace una sola cosa
- **DRY**: No repetición de código
- **Separación de responsabilidades**: Controllers, Models, Services
- **Componentes reutilizables**: UI components modulares
- **Custom Hooks**: Lógica reutilizable encapsulada

## 📊 API Endpoints

### Tickets
- `GET /api/tickets` - Obtener todos los tickets (con filtros opcionales)
- `GET /api/tickets/:id` - Obtener ticket por ID
- `POST /api/tickets` - Crear nuevo ticket
- `PUT /api/tickets/:id` - Actualizar ticket
- `POST /api/tickets/:id/comments` - Agregar comentario
- `DELETE /api/tickets/:id` - Eliminar ticket

### Servicios
- `GET /api/services` - Obtener todos los servicios
- `POST /api/services` - Crear servicio
- `POST /api/services/initialize` - Inicializar servicios predefinidos

### Estadísticas
- `GET /api/stats` - Obtener estadísticas completas
- `GET /api/stats/recent` - Obtener tickets recientes

## 🎨 Características de UI/UX

- **Diseño Moderno**: Interfaz limpia y profesional
- **Responsive**: Adaptado para desktop, tablet y móvil
- **Animaciones**: Transiciones suaves y feedback visual
- **Sistema de Colores**: Código de colores por prioridad y estado
- **Accesibilidad**: Labels, contraste adecuado
- **Loading States**: Spinners y estados de carga

## 📈 KPIs y Métricas

El sistema rastrea y visualiza:
- Total de tickets abiertos/resueltos/cerrados
- Tickets por prioridad (P1, P2, P3, P4)
- Tickets por servicio afectado
- Tickets por estado
- Tickets por categoría
- Tiempo promedio de resolución
- Tendencias temporales

## 🔧 Configuración de Desarrollo

### Scripts Disponibles

**Backend:**
- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor con nodemon

**Frontend:**
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Vista previa de build de producción

## 🤝 Contribución

Este proyecto fue desarrollado como parte del curso CC3047 - Administración y Mantenimiento de Sistemas de la Universidad del Valle de Guatemala.

## 📝 Licencia

ISC

## 👥 Equipo de Desarrollo

Proyecto desarrollado para la Fase 2: Service Desk del curso de Administración y Mantenimiento de Sistemas.

---

**Universidad del Valle de Guatemala**  
Facultad de Ingeniería - Departamento de Ciencias de la Computación  
CC3047 - Administración y Mantenimiento de Sistemas  
Semestre II 2025
