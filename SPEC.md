# La Pagina Perdida — Especificacion Tecnica

> E-commerce de libreria online con catalogo dinamico, autenticacion, carrito persistente y checkout simulado.

**Version:** 1.0
**Autor:** Cristian Micchele
**Ultima actualizacion:** 2026-08-30

---

## 1. Vision del Producto

Plataforma de venta de libros online que consume la Google Books API como fuente de catalogo, cachea los resultados en base de datos propia, y ofrece una experiencia completa de compra: busqueda, detalle, carrito, favoritos, checkout y historial de pedidos.

El pago es simulado — este es un proyecto de portfolio que demuestra arquitectura full-stack profesional, no un sistema de cobro real.

### 1.1 Objetivos

- Demostrar dominio de arquitectura full-stack moderna (Next.js + Express + PostgreSQL)
- Implementar flujos de e-commerce reales: carrito con merge guest/auth, checkout, historial
- Aplicar buenas practicas de seguridad, validacion y testing desde el dia uno
- Producir un codebase limpio, mantenible y desplegable

### 1.2 Alcance

**Incluido:**
- Catalogo de libros con busqueda, paginacion y categorias
- Autenticacion por email/password
- Carrito de compras (guest + autenticado con merge)
- Lista de favoritos
- Checkout con simulacion de pago
- Historial de pedidos
- Dark mode
- Responsive design

**Excluido (deliberadamente):**
- Pagos reales (Stripe, MercadoPago)
- OAuth (Google, GitHub) — removido por simplificacion de scope
- Panel de administracion
- Sistema de reviews o ratings
- Internacionalizacion (solo espanol)
- Notificaciones por email

---

## 2. Arquitectura

### 2.1 Stack

| Capa | Tecnologia | Justificacion |
|------|-----------|---------------|
| Frontend | Next.js 16 (App Router), TypeScript | SSR/SSG, file-based routing, React Server Components |
| UI | Tailwind CSS v4, shadcn/ui v4 | Utility-first, componentes accesibles, dark mode nativo |
| Estado cliente | Zustand (persist middleware) | Lightweight, persist en localStorage sin boilerplate |
| Backend | Express 5, TypeScript | Minimalista, control total sobre middleware y rutas |
| Validacion | Zod v4 | Schema-first, TypeScript-native, errores legibles |
| Base de datos | PostgreSQL via Supabase | Hosting gratuito, Auth integrado, SDK tipado |
| Auth | Supabase Auth | Email/password, JWT, password reset, session management |
| Catalogo | Google Books API | +40M de libros, covertura global, API gratuita |
| Tests | Vitest | Compatible con ESM, rapido, API similar a Jest |

### 2.2 Diagrama de capas

```
┌─────────────────────────────────────────────┐
│                  FRONTEND                    │
│        Next.js 16 (App Router + SSR)         │
│                                              │
│  Pages ─── Components ─── Hooks ─── Stores   │
│                    │                         │
│              Supabase Client (Auth)          │
└──────────────────┬──────────────────────────┘
                   │ HTTP (REST)
┌──────────────────┴──────────────────────────┐
│                  BACKEND                     │
│              Express 5 + TypeScript          │
│                                              │
│  Routes ─── Controllers ─── Services         │
│       │                        │             │
│   Middleware              Supabase Admin      │
│  (auth, validate,         (DB queries)       │
│   rate-limit, helmet)         │              │
└───────────────────────────┬──────────────────┘
                            │
┌───────────────────────────┴──────────────────┐
│              SUPABASE                         │
│     PostgreSQL  ·  Auth  ·  Storage           │
└──────────────────────────────────────────────┘
```

### 2.3 Estructura del proyecto

```
libreria/
├── frontend/                 # Next.js 16
│   └── src/
│       ├── app/              # Rutas (file-based)
│       │   ├── page.tsx              # Home — libros destacados
│       │   ├── buscar/               # Busqueda + catalogo
│       │   ├── libro/[id]/           # Detalle de libro
│       │   ├── carrito/              # Carrito de compras
│       │   ├── checkout/             # Formulario de pago
│       │   ├── pedido-confirmado/    # Confirmacion post-compra
│       │   ├── perfil/               # Cuenta del usuario
│       │   │   ├── favoritos/        # Lista de favoritos
│       │   │   └── pedidos/          # Historial de compras
│       │   └── auth/                 # Autenticacion
│       │       ├── login/
│       │       ├── registro/
│       │       ├── recuperar/        # Solicitar reset de password
│       │       └── nueva-password/   # Establecer nueva password
│       ├── components/       # UI components
│       │   ├── books/        # BookCard, BookDetail, BookGrid
│       │   ├── cart/         # CartItemCard
│       │   ├── layout/       # Navbar, Footer, DarkModeToggle
│       │   ├── auth/         # LoginForm
│       │   └── ui/           # shadcn/ui + ToastContainer
│       ├── hooks/            # useAuth, useCartSync, useFavorites
│       └── lib/              # Stores, utils, Supabase clients
│           ├── cart-store.ts
│           ├── toast-store.ts
│           ├── api.ts
│           ├── image-utils.ts
│           └── supabase/     # Client, server, middleware
│
└── backend/                  # Express 5
    └── src/
        ├── index.ts          # Entry point, middleware stack
        ├── config/           # env.ts (validated env vars)
        ├── routes/           # books, cart, favorites, orders
        ├── controllers/      # Request handlers
        ├── services/         # Business logic + Supabase queries
        ├── schemas/          # Zod validation schemas
        └── middleware/       # auth (JWT), validate (Zod), error-handler
```

---

## 3. Modelo de Datos

### 3.1 Entidades

```
┌──────────┐      ┌────────────┐      ┌──────────┐
│  books   │──1:N─│ cart_items  │──N:1─│  users   │
│          │      └────────────┘      │ (Supabase│
│          │──1:N─┌────────────┐──N:1─│  Auth)   │
│          │      │ favorites  │      │          │
│          │      └────────────┘      │          │
│          │──1:N─┌──────────────┐    │          │
│          │      │ order_items  │    │          │
└──────────┘      └──────┬───────┘    │          │
                         │N:1         │          │
                  ┌──────┴───────┐    │          │
                  │   orders     │─N:1┤          │
                  └──────────────┘    └──────────┘
```

### 3.2 Tablas

**books** — Libros cacheados desde Google Books API

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | UUID (PK) | Identificador interno |
| google_books_id | TEXT (UNIQUE) | ID de Google Books API |
| title | TEXT (NOT NULL) | Titulo del libro |
| authors | TEXT[] | Lista de autores |
| description | TEXT | Sinopsis |
| thumbnail_url | TEXT | URL de portada (publisher content endpoint) |
| categories | TEXT[] | Generos/categorias |
| published_date | TEXT | Fecha de publicacion |
| page_count | INTEGER | Cantidad de paginas |
| isbn | TEXT | ISBN-13 o ISBN-10 |
| price | DECIMAL (NOT NULL) | Precio de venta (asignado aleatoriamente al cachear) |
| stock | INTEGER (NOT NULL) | Unidades disponibles |
| is_featured | BOOLEAN | Aparece en la home |
| created_at | TIMESTAMPTZ | Fecha de creacion del registro |

**cart_items** — Carrito de usuario autenticado

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | UUID (PK) | |
| user_id | UUID (FK → auth.users) | |
| book_id | UUID (FK → books) | |
| quantity | INTEGER (NOT NULL) | Cantidad (1-10) |
| created_at | TIMESTAMPTZ | |
| | UNIQUE(user_id, book_id) | Un item por libro por usuario |

**favorites** — Lista de deseos

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | UUID (PK) | |
| user_id | UUID (FK → auth.users) | |
| book_id | UUID (FK → books) | |
| created_at | TIMESTAMPTZ | |
| | UNIQUE(user_id, book_id) | Sin duplicados |

**orders** — Pedidos completados

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | UUID (PK) | |
| user_id | UUID (FK → auth.users) | |
| order_number | TEXT (UNIQUE) | Formato `LIB-{base36}` |
| total | DECIMAL | Total del pedido |
| item_count | INTEGER | Cantidad de items |
| shipping_name | TEXT | Nombre de envio |
| shipping_email | TEXT | Email de contacto |
| shipping_address | TEXT | Direccion completa |
| status | TEXT | Default: `completed` |
| created_at | TIMESTAMPTZ | |

**order_items** — Items de cada pedido

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| id | UUID (PK) | |
| order_id | UUID (FK → orders, CASCADE) | |
| book_id | UUID (FK → books, nullable) | Puede ser null si el libro se borra |
| title | TEXT | Snapshot del titulo al momento de compra |
| author | TEXT | Snapshot del autor |
| price | DECIMAL | Precio al momento de compra |
| quantity | INTEGER | Cantidad comprada |
| thumbnail_url | TEXT | Portada al momento de compra |

---

## 4. Requisitos Funcionales

### RF-01: Catalogo y busqueda

- El usuario puede buscar libros por titulo o autor
- Los resultados se paginan (10 por pagina)
- La pagina `/buscar` sin query muestra un catalogo general con sugerencias de autor
- Los libros nuevos se cachean automaticamente en la DB al ser encontrados via API

### RF-02: Detalle de libro

- Muestra portada de alta resolucion (publisher content endpoint de Google Books)
- Informacion: titulo, autor, precio, stock, sinopsis, paginas, fecha, ISBN, categorias
- Botones de accion: agregar al carrito, agregar a favoritos
- Feedback visual al agregar (check icon + toast notification)

### RF-03: Carrito de compras

- **Guest:** persiste en localStorage via Zustand persist middleware
- **Autenticado:** persiste en la DB (tabla `cart_items`)
- **Merge:** al iniciar sesion, el carrito guest se mergea con el de la DB automaticamente
- Cantidad limitada al stock disponible (cap en store y en validacion backend)
- Operaciones: agregar, actualizar cantidad, eliminar, vaciar

### RF-04: Autenticacion

- Registro con email y password
- Login con email y password
- Logout (limpia sesion, redirige a home)
- Password reset: solicitar link por email → establecer nueva password
- Rutas protegidas: `/perfil/*` y `/checkout` redirigen a login con `returnTo`
- Usuarios autenticados no pueden acceder a `/auth/*` (excepto `/auth/nueva-password`)
- Errores amigables en login (mapa de codigos Supabase → mensajes en espanol)

### RF-05: Favoritos

- Solo para usuarios autenticados
- Agregar/quitar desde la pagina de detalle del libro
- Vista de favoritos en `/perfil/favoritos`
- Toast informativo si el usuario no esta logueado e intenta agregar

### RF-06: Checkout

- Requiere autenticacion (ruta protegida)
- Formulario: nombre, email, direccion, ciudad, codigo postal, telefono (opcional)
- Resumen del pedido con items, cantidades y total
- Simulacion de pago (delay de 2.5s con spinner)
- Persistencia del pedido en DB (best-effort para usuarios logueados)
- Redireccion a pagina de confirmacion con detalle del pedido

### RF-07: Historial de pedidos

- Solo para usuarios autenticados
- Vista en `/perfil/pedidos`
- Cards expandibles (accordion) con items, precios, datos de envio
- Ordenados por fecha descendente

### RF-08: Dark mode

- Toggle en navbar
- Persistencia de preferencia
- Transicion suave entre modos

### RF-09: UI/UX

- Skeleton loaders durante la carga de datos
- Toast notifications para acciones (agregar al carrito, errores de auth, favoritos)
- Responsive design (mobile-first)
- Animaciones de entrada (fade-in, slide-in)

---

## 5. API REST

Base URL: `/api`

### Books

| Metodo | Ruta | Auth | Body/Query | Descripcion |
|--------|------|------|------------|-------------|
| GET | `/books/search` | No | `?q=&page=` | Buscar libros (pagina de 10) |
| GET | `/books/featured` | No | — | Libros destacados para la home |
| GET | `/books/:id` | No | — | Detalle de un libro |

### Cart

| Metodo | Ruta | Auth | Body | Descripcion |
|--------|------|------|------|-------------|
| GET | `/cart` | Si | — | Obtener carrito del usuario |
| POST | `/cart` | Si | `{ bookId: UUID, quantity: 1-10 }` | Agregar item |
| PATCH | `/cart/:itemId` | Si | `{ quantity: 1-10 }` | Actualizar cantidad |
| DELETE | `/cart/:itemId` | Si | — | Eliminar item |
| POST | `/cart/merge` | Si | `{ items: [{ bookId, quantity }] }` | Merge carrito guest |

### Favorites

| Metodo | Ruta | Auth | Body | Descripcion |
|--------|------|------|------|-------------|
| GET | `/favorites` | Si | — | Listar favoritos |
| POST | `/favorites` | Si | `{ bookId: UUID }` | Agregar favorito |
| DELETE | `/favorites/:bookId` | Si | — | Eliminar favorito |

### Orders

| Metodo | Ruta | Auth | Body | Descripcion |
|--------|------|------|------|-------------|
| GET | `/orders` | Si | — | Historial de pedidos |
| POST | `/orders` | Si | Ver schema | Crear pedido |

### Health

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |

---

## 6. Seguridad

### 6.1 Medidas implementadas

| Medida | Implementacion |
|--------|---------------|
| Helmet | Headers de seguridad HTTP en todas las respuestas |
| CORS | Origen restringido a `FRONTEND_URL` |
| Rate limiting | 100 req/15min por IP en `/api/` |
| Body size limit | `express.json({ limit: "16kb" })` |
| Validacion de inputs | Zod v4 en todos los endpoints que reciben body |
| Autenticacion | JWT via Supabase Auth, verificado en middleware |
| Rutas protegidas | Middleware de Next.js redirige a login |
| Errores opacos | Mensajes amigables, sin exponer detalles internos |

### 6.2 Flujo de autenticacion

```
[Login Form] ──email/pass──→ [Supabase Auth] ──JWT──→ [Cookie HttpOnly]
                                                           │
[Frontend Request] ──Cookie──→ [Next.js Middleware] ──getUser()──→ Allow/Redirect
                                                           │
[API Request] ──Bearer JWT──→ [auth middleware] ──verify──→ req.user ──→ Controller
```

### 6.3 Password reset

```
[/auth/recuperar] ──email──→ Supabase resetPasswordForEmail()
                                    │
                              Email con link
                                    │
                              /auth/nueva-password
                                    │
                              updateUser({ password })
```

---

## 7. Estado del Cliente

### 7.1 Zustand Stores

**cart-store** (persistido en localStorage como `la-pagina-perdida-cart`)
- `items: CartItem[]` — libros en el carrito con cantidad
- `addItem(book, qty)` — agrega o incrementa (cap al stock)
- `removeItem(bookId)` — elimina
- `updateQuantity(bookId, qty)` — actualiza (elimina si <=0)
- `clear()` — vacia el carrito
- `getTotal()` — suma total
- `getItemCount()` — cantidad de items

**toast-store** (en memoria, no persistido)
- `toasts: Toast[]` — notificaciones activas
- `addToast(toast)` — agrega con auto-dismiss a 4 segundos
- `removeToast(id)` — elimina manualmente

### 7.2 Custom Hooks

- **useAuth** — user, session, loading, logout (centralizado)
- **useCartSync** — sincroniza carrito local con DB al detectar sesion
- **useFavorites** — CRUD de favoritos con estado optimista

---

## 8. Decisiones Tecnicas

### DT-01: Google Books como catalogo

**Problema:** Necesitamos un catalogo extenso sin cargar datos manualmente.
**Decision:** Consumir Google Books API y cachear en Supabase.
**Tradeoff:** Dependencia de API externa, pero +40M de libros disponibles sin esfuerzo de carga.

### DT-02: Carrito dual (guest + auth)

**Problema:** Permitir agregar al carrito sin forzar login.
**Decision:** localStorage para guests, DB para autenticados, merge automatico al loguearse.
**Tradeoff:** Logica de merge agrega complejidad, pero mejora significativamente la UX.

### DT-03: Publisher content endpoint para portadas

**Problema:** Las URLs estandar de Google Books devuelven thumbnails de 128px (borrosas).
**Decision:** Usar `books.google.com/books/publisher/content/images/frontcover/{id}?fife=w400-h600`.
**Tradeoff:** No todas las portadas estan disponibles en este endpoint; fallback a la URL original.

### DT-04: Checkout simulado

**Problema:** Integrar pagos reales agrega complejidad y costos para un proyecto de portfolio.
**Decision:** Simular el flujo completo (formulario → processing → confirmacion) sin cobro real.
**Tradeoff:** No demuestra integracion con pasarela de pago, pero el flujo de UX es identico.

### DT-05: Persistencia de pedidos best-effort

**Problema:** El checkout debe funcionar incluso si la API falla.
**Decision:** Guardar el pedido en DB dentro de un try/catch sin bloquear el flujo.
**Tradeoff:** Un pedido podria no persistir si la API esta caida, pero el usuario siempre ve su confirmacion.

### DT-06: Zod v4 para validacion

**Problema:** Validar inputs del usuario de forma tipada y con mensajes claros.
**Decision:** Schemas Zod en cada endpoint que recibe body, con middleware reutilizable.
**Tradeoff:** Ninguno significativo — Zod es la eleccion estandar para TypeScript.

---

## 9. Testing

### 9.1 Estrategia

- **Unit tests** con Vitest en ambas capas (frontend + backend)
- **No hay tests E2E** — fuera de alcance para v1
- **Mock pattern:** Proxy-based chainable mock para simular la API de Supabase

### 9.2 Cobertura actual

| Capa | Tests | Que cubren |
|------|-------|-----------|
| Backend services | 10 | cart (6), favorites (4) |
| Backend middleware | 5 | validate (valid, invalid, types, unknown keys, empty body) |
| Frontend stores | 17 | cart-store (12), toast-store (5) |
| Frontend utils | 7 | image-utils (null, placeholders, ID extraction, fallback) |
| **Total** | **39** | |

---

## 10. Despliegue

### 10.1 Infraestructura objetivo

| Componente | Plataforma |
|-----------|-----------|
| Frontend | Vercel |
| Backend | Render |
| Base de datos | Supabase (plan gratuito) |

### 10.2 Variables de entorno requeridas

**Backend (Render):**
- `PORT`
- `FRONTEND_URL` (URL de Vercel en produccion)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_BOOKS_API_KEY`

**Frontend (Vercel):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL` (URL de Render en produccion)
