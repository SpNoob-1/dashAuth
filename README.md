# Documento Técnico de Especificación y Exportación de Backlog

Este documento reúne la consolidación de tickets de trabajo con la información técnica pertinente de arquitectura, esquema de base de datos, reglas del motor de estados e inmutabilidad, para su implementación por parte del equipo de ingeniería.

## I. Ficha Técnica y Descripción de Arquitectura

```
                     ┌─────────────────────────────────────────┐
                     │     Base de Datos Relacional Core       │
                     │  (Ubicaciones, Usuarios, Categorías,    │
                     │   Productos/Landing, Pedidos/Detalle,   │
                     │   Estados Finales e Inmutables)         │
                     └────────────────────┬────────────────────┘
                                          │
                     ┌────────────────────┴────────────────────┐
                     │      Servicio Core Transversal          │
                     │   (JWT Auth Bearer / Hash / Mailer /    │
                     │    Validaciones del Motor de Estados)   │
                     └────────────────────┬────────────────────┘
                                          │
           ┌──────────────────────────────┴──────────────────────────────┐
           ▼                                                             ▼
┌─────────────────────────────────────┐               ┌─────────────────────────────────────┐
│             Sistema 1:              │               │             Sistema 2:              │
│ E-Commerce / Landing / Compra       │               │ ERP / Panel de Administración       │
└─────────────────────────────────────┘               └─────────────────────────────────────┘

```

### 1. Stack Tecnológico General

- **Base de Datos:** PostgreSQL / MySQL (Relacional con restricciones de integridad referencial).
- **Backend:** Node.js (Express / NestJS) o C# (.NET Core API) / Python (FastAPI).
- **Frontend E-Commerce & ERP:** Next.js / React con TypeScript.
- **Seguridad:** Autenticación por Tokens JWT (Bearer Token) y Middleware de RBAC (`CLIENTE` vs `ADMIN`).

## II. Definición del Motor de Estados e Inmutabilidad

```
                  ┌─────────────────┐
                  │    PENDIENTE    │ (Transitorio)
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ EN_PREPARACION  │ (Transitorio)
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │      LISTO      │ (Transitorio) -> Dispara Email "Pedido Listo"
                  └────────┬────────┘
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│    ENTREGADO    │ (Final)         │    CANCELADO    │ (Final)
└─────────────────┘                 └─────────────────┘

```

- **Estados Transitorios (`PENDIENTE`, `EN_PREPARACION`, `LISTO`):** Permiten avanzar de estado en la secuencia definida.
- **Estados Finales (`ENTREGADO`, `CANCELADO`):** Son inmutables. El Backend debe denegar cualquier petición HTTP `PATCH` o `PUT` sobre pedidos en estos estados con error `400 Bad Request`.
- **Automatizaciones Integradas:** Al pasar de `EN_PREPARACION` a `LISTO`, el backend invoca el servicio transaccional para notificar vía e-mail al cliente que su pedido está preparado.

## III. Catálogo Granulado de Tickets de Trabajo

### Epic 1: Módulos Core Transversales

#### Ticket `CORE-01`: Arquitectura y Esquema DDL de Base de Datos Relacional

- **Tipo:** Task / Database
- **Estimación:** 5 Story Points
- **Descripción:** Implementar el script DDL para las 11 tablas del sistema relacional (`departamentos`, `municipios`, `usuarios`, `direcciones`, `categorias`, `productos`, `landing_secciones`, `estados_pedido`, `pedidos`, `detalle_pedidos`, `exclusiones_detalle`).
- **Criterios de Aceptación:**
  1. Configuración de claves foráneas con `ON DELETE RESTRICT` para evitar el borrado accidental de productos o categorías asociadas a pedidos.
  2. Implementación de snapshot de la dirección de entrega en la tabla `pedidos`.
  3. Creación e inserción de datos semilla (*seeders*) para los 5 estados base (`PENDIENTE`, `EN_PREPARACION`, `LISTO`, `ENTREGADO`, `CANCELADO`) especificando cuáles son finales mediante un booleano `es_final`.

#### Ticket `CORE-02`: Módulo de Autenticación, JWT y RBAC

- **Tipo:** Task / Backend
- **Estimación:** 5 Story Points
- **Descripción:** Desarrollar el servicio centralizado de autenticación con hashing seguro de contraseñas (`bcrypt`/`argon2`) e inclusión de la matriz de roles (`CLIENTE`, `ADMIN`).
- **Criterios de Aceptación:**
  1. Endpoint `POST /api/v1/auth/register` (creación de cuenta con rol `CLIENTE`).
  2. Endpoint `POST /api/v1/auth/login` con retorno de JWT Bearer Token.
  3. Middleware de autenticación de token y guardias de ruta para la restricción por rol `ADMIN`.

#### Ticket `CORE-03`: Servicio Transaccional de Correos Electrónicos

- **Tipo:** Task / Backend
- **Estimación:** 3 Story Points
- **Descripción:** Integrar el servicio de envío de correos (Nodemailer, Resend, SendGrid) desacoplado mediante eventos/módulos.
- **Criterios de Aceptación:**
  1. Generación de plantillas HTML responsivas para: Bienvenida, Confirmación de Pedido y Notificación de "Pedido Listo".
  2. Integración asíncrona para que la falla del motor de e-mails no bloquee las transacciones de base de datos.

#### Ticket `CORE-04`: Flujo de Recuperación de Contraseña

- **Tipo:** Feature / Backend
- **Estimación:** 3 Story Points
- **Descripción:** Implementar el mecanismo seguro para restablecer credenciales de acceso vía correo electrónico.
- **Criterios de Aceptación:**
  1. Endpoint `POST /api/v1/auth/forgot-password` que genera un token firmado de uso único con vigencia máxima de 15 minutos.
  2. Endpoint `POST /api/v1/auth/reset-password` para aplicar la actualización del `password_hash`.

### Epic 2: Backend API REST

#### Ticket `BACK-01`: API Pública de Catálogo y Landing Page

- **Tipo:** Feature / Backend
- **Estimación:** 3 Story Points
- **Descripción:** Proveer endpoints de lectura pública para la Landing Page y el catálogo general de productos.
- **Criterios de Aceptación:**
  1. Endpoint `GET /api/v1/landing` que retorna categorías y productos filtrados por `mostrar_en_landing = true` y ordenados según `orden_landing`.
  2. Endpoints `GET /api/v1/catalog/categories`, `GET /api/v1/catalog/products` (con soporte para parámetro `?categoria_id=`) y `GET /api/v1/catalog/products/:id`.

#### Ticket `BACK-02`: API de Libreta de Direcciones del Cliente

- **Tipo:** Feature / Backend
- **Estimación:** 3 Story Points
- **Descripción:** Servicios para consultar departamentos, municipios y la gestión de direcciones del perfil.
- **Criterios de Aceptación:**
  1. Endpoint público `GET /api/v1/addresses/locations` con la jerarquía completa de ubicaciones.
  2. Endpoints protegidos `GET /api/v1/addresses` y `POST /api/v1/addresses` vinculando la nueva dirección con un alias obligatorio al cliente autenticado.

#### Ticket `BACK-03`: API de Checkout y Registro de Pedidos

- **Tipo:** Feature / Backend
- **Estimación:** 5 Story Points
- **Descripción:** Procesamiento transaccional de compras con congelamiento de precios/dirección y registro de exclusiones dinámicas.
- **Criterios de Aceptación:**
  1. Endpoint `POST /api/v1/orders` protegido para clientes autenticados.
  2. Guardado en snapshot de la dirección del cliente y del detalle de ítems (con precios al momento de la compra).
  3. Registro dinámico de exclusiones de ingredientes en la tabla `exclusiones_detalle`.
  4. Disparo automático del e-mail de **Confirmación de Pedido**.
  5. Endpoint `GET /api/v1/orders/my-orders` para consultar el historial del usuario.

#### Ticket `BACK-04`: API ERP - CRUD de Productos y Configuración de Landing

- **Tipo:** Feature / Backend
- **Estimación:** 5 Story Points
- **Descripción:** Módulo de administración de productos y organización visual del catálogo en la Landing Page.
- **Criterios de Aceptación:**
  1. Endpoints de creación, actualización e inactivación de productos (`POST`, `PUT` en `/api/v1/admin/products`).
  2. Endpoint `PATCH /api/v1/admin/landing/products/:id/toggle-landing` para alternar la visibilidad en el inicio.
  3. Endpoint `PUT /api/v1/admin/landing/products/reorder` con soporte transaccional SQL para reorganizar posiciones (`orden_landing`).

#### Ticket `BACK-05`: API ERP - Engine de Estados e Inmutabilidad

- **Tipo:** Feature / Backend
- **Estimación:** 5 Story Points
- **Descripción:** Implementar la lógica del motor de estados, validación de secuencia y bloqueo por inmutabilidad.
- **Criterios de Aceptación:**
  1. Endpoint `PATCH /api/v1/admin/orders/:id/status` accesible solo para el rol `ADMIN`.
  2. Verificación previa: Si el pedido se encuentra en `ENTREGADO` o `CANCELADO`, rechazar la actualización respondiendo HTTP `400 Bad Request` ("El pedido está en un estado final e inmutable").
  3. Validar que la transición siga el flujo estricto (`PENDIENTE` -> `EN_PREPARACION` -> `LISTO` -> `ENTREGADO` / `CANCELADO`).
  4. Disparar e-mail automático al cliente cuando el estado sea actualizado a `LISTO`.

### Epic 3: Frontend E-Commerce

#### Ticket `FRONT-EC-01`: Layout de Landing Page y Navegación de Catálogo

- **Tipo:** Feature / Frontend
- **Estimación:** 5 Story Points
- **Descripción:** Interfaz principal responsiva consumiendo el API de Landing y Catálogo.
- **Criterios de Aceptación:**
  1. Mapeo dinámico de secciones y tarjetas de producto (ingredientes y días de entrega).
  2. Filtro interactivo por categorías sin recarga completa de la página.

#### Ticket `FRONT-EC-02`: Carrito de Compras con Especificación de Exclusiones

- **Tipo:** Feature / Frontend
- **Estimación:** 5 Story Points
- **Descripción:** Manejo del estado global del carrito con entrada libre para especificaciones del cliente.
- **Criterios de Aceptación:**
  1. Persistencia local del estado del carrito (LocalStorage).
  2. Campo de texto/chips por cada ítem en el carrito para especificar exclusiones (*Sin gluten*, *Sin lactosa*, etc.).

#### Ticket `FRONT-EC-03`: Módulo de Autenticación de Cliente

- **Tipo:** Feature / Frontend
- **Estimación:** 3 Story Points
- **Descripción:** Vistas y formularios para inicio de sesión, registro y restablecimiento de contraseña.
- **Criterios de Aceptación:**
  1. Validaciones en tiempo de ejecución de formato e-mail y seguridad de contraseñas.
  2. Almacenamiento seguro del JWT en el cliente e inyección en el header `Authorization: Bearer <token>`.

#### Ticket `FRONT-EC-04`: Checkout de Compra y Selección de Ubicación

- **Tipo:** Feature / Frontend
- **Estimación:** 5 Story Points
- **Descripción:** Formulario final de procesamiento de orden con integración de libreta de direcciones.
- **Criterios de Aceptación:**
  1. Selector para elegir una dirección guardada o ingresar una nueva mediante selectores en cascada (Departamento -> Municipio).
  2. Envío del payload estructurado hacia `POST /api/v1/orders` y redirección a la pantalla de confirmación exitosa.

### Epic 4: Frontend ERP (Panel de Administración)

#### Ticket `FRONT-ERP-01`: Layout Administrativo y Control de Acceso

- **Tipo:** Feature / Frontend
- **Estimación:** 3 Story Points
- **Descripción:** Estructura base del panel ERP con protección de rutas.
- **Criterios de Aceptación:**
  1. Formulario de ingreso para administradores.
  2. Guardias de navegación en el cliente para bloquear accesos no autorizados si el token no tiene rol `ADMIN`.

#### Ticket `FRONT-ERP-02`: Panel de Administración de Productos y Landing

- **Tipo:** Feature / Frontend
- **Estimación:** 5 Story Points
- **Descripción:** Formulario CRUD de catálogo y controles drag-and-drop / selectores para reordenar la landing page.
- **Criterios de Aceptación:**
  1. Creación/Edición de productos con validaciones de precios y días de preparación.
  2. Interfaz para cambiar estado de `mostrar_en_landing` y guardar el nuevo orden visual de la tienda.

#### Ticket `FRONT-ERP-03`: Panel de Monitoreo de Pedidos e Inmutabilidad Visual

- **Tipo:** Feature / Frontend
- **Estimación:** 5 Story Points
- **Descripción:** Vista tipo Kanban/Tabla de seguimiento de pedidos con código de colores por estado y bloqueo de acciones.
- **Criterios de Aceptación:**
  1. Visualización clara de los badges de estado (Transitorios: Azul/Amarillo; Finales: Verde/Rojo).
  2. Desglose del detalle de pedido destacando de manera visual las exclusiones del cliente (ej. *"Sin Gluten"*).
  3. Deshabilitar controles de cambio de estado en pedidos con estado `ENTREGADO` o `CANCELADO`, mostrando un mensaje/tooltip: *"Este pedido se encuentra en un estado final e inmutable"*.
  4. Mostrar notificación visual de envío de e-mail cuando un pedido se cambie al estado `LISTO`.

## IV. Matriz de Planificación por Sprints

```
Sprint 1: CORE-01, CORE-02, CORE-03, CORE-04, FRONT-EC-03, FRONT-ERP-01 (22 pts)
Sprint 2: BACK-01, BACK-04, FRONT-EC-01, FRONT-EC-02, FRONT-ERP-02      (23 pts)
Sprint 3: BACK-02, BACK-03, BACK-05, FRONT-EC-04, FRONT-ERP-03           (23 pts)

```

| **Sprint**                                    | **Backend / Base de Datos**                | **Frontend E-Commerce**      | **Frontend ERP** | **Puntos Totales** |
| --------------------------------------------- | ------------------------------------------ | ---------------------------- | ---------------- | ------------------ |
| **Sprint 1: Core, Auth & Base de Datos**      | `CORE-01`, `CORE-02`, `CORE-03`, `CORE-04` | `FRONT-EC-03`                | `FRONT-ERP-01`   | **22 pts**         |
| **Sprint 2: Catálogo & Carrito**              | `BACK-01`, `BACK-04`                       | `FRONT-EC-01`, `FRONT-EC-02` | `FRONT-ERP-02`   | **23 pts**         |
| **Sprint 3: Checkout & Motor de Estados ERP** | `BACK-02`, `BACK-03`, `BACK-05`            | `FRONT-EC-04`                | `FRONT-ERP-03`   | **23 pts**         |

##