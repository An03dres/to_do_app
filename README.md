# To Do App - Proyecto Final

Este proyecto es una aplicación de tareas (To Do App) desarrollada con **Vue 3**, **Vite**, **Pinia** para el manejo de estado, **Vue Router** para el enrutamiento, **Supabase** como backend (autenticación y base de datos), y **SweetAlert2** para notificaciones. El diseño utiliza estilos modernos con efectos de glassmorphism y es responsivo.

## Características principales

- **Autenticación de usuarios:** Registro, inicio y cierre de sesión usando Supabase.
- **Persistencia de sesión:** El usuario permanece autenticado gracias a Pinia y su plugin de persistencia.
- **Gestión de tareas:** Crear, editar, marcar como completada/incompleta y eliminar tareas, asociadas a cada usuario.
- **Interfaz moderna:** Uso de efectos visuales, imágenes de fondo y componentes reutilizables (Nav, Footer).
- **Notificaciones amigables:** Mensajes de éxito y error con SweetAlert2.
- **Rutas protegidas:** Solo usuarios autenticados pueden acceder al dashboard de tareas.

## Estructura del proyecto

- `src/`
  - `App.vue`: Componente raíz, incluye la navegación, el router-view y el footer.
  - `main.js`: Punto de entrada, configura Vue, Pinia y Vue Router.
  - `supabase.js`: Configuración y exportación del cliente de Supabase.
  - `components/`
    - `Nav.vue`: Barra de navegación superior, muestra el usuario y opciones de login/logout.
    - `Footer.vue`: Pie de página fijo.
  - `pages/`
    - `Auth.vue`: Página de autenticación (login y registro).
    - `Dashboard.vue`: Página principal para gestionar las tareas del usuario.
  - `router/`
    - `index.js`: Configuración de rutas y protección de rutas privadas.
  - `store/`
    - `user.js`: Store Pinia para autenticación y gestión del usuario.
    - `task.js`: Store Pinia para operaciones CRUD de tareas.
  - `assets/`: Imágenes usadas en la interfaz.
  - `static/main.css`: Estilos personalizados para SweetAlert2.

## Flujo de la aplicación

1. **Autenticación:**  
   El usuario puede registrarse o iniciar sesión en `/auth`. Si ya está autenticado, se le redirige al dashboard.
2. **Dashboard:**  
   Una vez autenticado, accede a `/` donde puede ver, crear, editar, completar o eliminar sus tareas.
3. **Protección de rutas:**  
   Si intenta acceder al dashboard sin autenticarse, será redirigido a `/auth`.
4. **Persistencia:**  
   La sesión y las tareas se mantienen aunque el usuario recargue la página.

## Instalación y ejecución

1. Instala las dependencias:
   ```sh
   npm install
   ```
2. Crea un archivo `.env` con tu clave de Supabase:
   ```
   VITE_SUPABASE_KEY=tu_clave_supabase
   ```
3. Inicia el servidor de desarrollo:
   ```sh
   npm run dev
   ```

## Dependencias principales

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Supabase](https://supabase.com/)
- [SweetAlert2](https://sweetalert2.github.io/)

## Estructura de la base de datos (Supabase)

- Tabla `users`: Gestionada automáticamente por Supabase Auth.
- Tabla `tasks`:
  - `id`: integer, primary key
  - `name`: text
  - `status`: text (`incomplete` o `complete`)
  - `user_id`: uuid (relación con el usuario)
  - `due_date`: timestamp

## Créditos

Desarrollado como proyecto final usando Vue 3, Vite y Supabase.

---
