# Service Desk - Sistema de Gestión de Uniformes

Sistema completo de Service Desk para atención de problemas y gestión de tickets, desarrollado específicamente para el proyecto de gestión de uniformes escolares e industriales. **Utiliza GitLab Issues como backend para la gestión de tickets.**

## 📋 Descripción

Este proyecto implementa un Service Desk basado en las mejores prácticas de ITIL v4, diseñado para gestionar incidentes, solicitudes de servicio y problemas relacionados con:

- **Gestión de Inventarios**: Control de materias primas y productos terminados
- **Portal de Clientes**: Plataforma web para catálogo y pedidos
- **Sistema de Pedidos**: Procesamiento y gestión de pedidos
- **Tracking de Producción**: Seguimiento en tiempo real del estado de producción
- **Catálogo de Productos**: Visualización de productos disponibles
- **Autenticación y Accesos**: Sistema de login y permisos

**Arquitectura**: La aplicación es un frontend React que se conecta directamente a la API de GitLab para gestionar tickets como Issues, eliminando la necesidad de un backend personalizado y base de datos propia.

## 🚀 Características

### Funcionalidades Principales

1. **Ingreso de Tickets**
   - Formulario completo para reportar problemas o solicitudes
   - Categorización por servicio, prioridad y tipo
   - Información del usuario afectado en la descripción
   - **Creación directa como GitLab Issues**

2. **Tablero de Seguimiento**
   - Vista simplificada con tickets agrupados por estado (Abiertos/Cerrados)
   - Filtros por prioridad y etiquetas
   - Datos en tiempo real desde GitLab

3. **Detalle de Tickets**
   - Vista completa de información del issue de GitLab
   - Sistema de comentarios usando GitLab Notes
   - Edición de estado (abrir/cerrar)
   - Visualización de etiquetas, autor y asignados
   - **Todos los datos provienen directamente de GitLab**

4. **Integración Completa con GitLab**
   - Frontend se conecta directamente a la API de GitLab
   - No requiere backend personalizado
   - Labels automáticos por servicio, categoría y prioridad
   - Proyecto GitLab: https://gitlab.com/proyecto/75469260

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

### Frontend (Aplicación Principal)
- **React 18** con Vite
- **React Router** para navegación
- **Axios** para peticiones a GitLab API
- **Lucide React** para iconos
- **date-fns** para manejo de fechas
- Diseño responsive con CSS moderno

### Backend (GitLab)
- **GitLab Issues** como sistema de tickets
- **GitLab Notes** como sistema de comentarios
- **GitLab Labels** para categorización
- **GitLab API v4** como backend completo

## 📦 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- Cuenta de GitLab y token de acceso personal

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd service-desk
```

### 2. Obtener Token de GitLab

1. Ir a GitLab: https://gitlab.com/-/profile/personal_access_tokens
2. Crear un nuevo token con los siguientes scopes:
   - `api` (acceso completo a la API)
   - `read_api`
   - `write_repository`
3. Copiar el token generado (¡guárdalo en un lugar seguro!)

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env` en la carpeta `frontend`:
```env
VITE_GITLAB_TOKEN=tu_token_de_gitlab_aquí
```

**⚠️ IMPORTANTE**: Nunca subas el archivo `.env` a Git. Ya está incluido en `.gitignore`.

### 4. Iniciar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## ⚙️ Configuración del Proyecto GitLab

El proyecto utiliza el siguiente proyecto de GitLab:
- **Project ID**: 75469260
- **API Base URL**: https://gitlab.com/api/v4
- **Endpoints principales**:
  - `GET /projects/75469260/issues` - Obtener todos los issues
  - `POST /projects/75469260/issues` - Crear un issue
  - `GET /projects/75469260/issues/:iid/notes` - Obtener comentarios
  - `POST /projects/75469260/issues/:iid/notes` - Agregar comentario

## 🚀 Uso

1. **Iniciar la aplicación**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Acceder a la aplicación**
   - Abrir navegador en `http://localhost:5173`

3. **Funcionalidades disponibles**
   - **Dashboard**: Vista general con acceso rápido
   - **Crear Ticket**: Formulario para crear nuevos issues en GitLab
   - **Tablero**: Ver todos los tickets agrupados por estado (Abiertos/Cerrados)
   - **Detalle de Ticket**: Ver información completa, comentarios y actualizar estado

## 📁 Estructura del Proyecto

```
service-desk/
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── Layout/      # Layout principal con navegación
│   │   │   ├── TicketCard/  # Tarjeta de ticket individual
│   │   │   └── CommentList/ # Lista de comentarios
│   │   ├── context/         # Context API
│   │   │   └── TicketContext.jsx  # Estado global de tickets
│   │   ├── hooks/           # Custom hooks
│   │   │   ├── useTicket.js       # Hook para un ticket individual
│   │   │   └── useStats.js        # Hook para estadísticas
│   │   ├── pages/           # Páginas principales
│   │   │   ├── Dashboard.jsx      # Página de inicio
│   │   │   ├── CreateTicket.jsx   # Formulario de creación
│   │   │   ├── TicketBoard.jsx    # Tablero de tickets
│   │   │   ├── TicketDetail.jsx   # Detalle de ticket
│   │   │   └── Statistics.jsx     # Estadísticas
│   │   ├── services/        # Servicios de API
│   │   │   └── gitlabService.js   # Cliente de GitLab API
│   │   ├── App.jsx          # Componente raíz
│   │   ├── main.jsx         # Punto de entrada
│   │   └── index.css        # Estilos globales
│   ├── .env                 # Variables de entorno (NO subir a Git)
│   ├── .gitignore           # Archivos ignorados
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                 # (Legacy - ya no se usa)
├── README.md
├── ARQUITECTURA.md
└── GUIA_DE_USO.md
```

## 🎯 Principios de Clean Code Aplicados

- **Nombres descriptivos**: Variables y funciones con nombres claros
- **Funciones pequeñas**: Cada función hace una sola cosa
- **DRY**: No repetición de código
- **Separación de responsabilidades**: Controllers, Models, Services
- **Componentes reutilizables**: UI components modulares
- **Custom Hooks**: Lógica reutilizable encapsulada

## 📊 Integración con GitLab API

La aplicación utiliza directamente la API de GitLab para todas las operaciones:

### Issues (Tickets)
- `GET /projects/75469260/issues` - Obtener todos los issues
- `GET /projects/75469260/issues/:iid` - Obtener issue específico
- `POST /projects/75469260/issues` - Crear nuevo issue
- `PUT /projects/75469260/issues/:iid` - Actualizar issue

### Notes (Comentarios)
- `GET /projects/75469260/issues/:iid/notes` - Obtener comentarios de un issue
- `POST /projects/75469260/issues/:iid/notes` - Agregar comentario a un issue

### Autenticación
Todas las peticiones incluyen el header:
```
PRIVATE-TOKEN: tu_token_de_gitlab
```

## 🎨 Características de UI/UX

- **Diseño Moderno**: Interfaz limpia y profesional
- **Responsive**: Adaptado para desktop, tablet y móvil
- **Animaciones**: Transiciones suaves y feedback visual
- **Sistema de Colores**: Código de colores por prioridad y estado
- **Accesibilidad**: Labels, contraste adecuado
- **Loading States**: Spinners y estados de carga

## 📈 Categorización y Etiquetas

El sistema utiliza etiquetas (labels) de GitLab para categorizar:

### Etiquetas de Servicio
- Autenticación
- Catálogo
- Creación de pedidos
- Inventario
- Tracking
- UX/UI
- Visualización de pedidos

### Etiquetas de Prioridad
- P1 (Crítico)
- P2 (Alto)
- P3 (Medio)
- P4 (Bajo)

### Etiquetas de Categoría
- Incidente
- Solicitud de Servicio
- Consulta
- Cambio

Todos los tickets se crean con estas etiquetas automáticamente desde el formulario.

## 🔧 Configuración de Desarrollo

### Scripts Disponibles

**Frontend:**
- `npm run dev` - Inicia el servidor de desarrollo (puerto 5173)
- `npm run build` - Construye para producción
- `npm run preview` - Vista previa de build de producción
- `npm run lint` - Ejecuta ESLint para verificar código

### Variables de Entorno

Crear archivo `.env` en la carpeta `frontend`:
```env
VITE_GITLAB_TOKEN=tu_token_aqui
```

**Seguridad**: El token se mantiene en el frontend pero no se expone en el código fuente. Para producción, considerar usar un backend proxy que maneje el token de forma segura.

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
