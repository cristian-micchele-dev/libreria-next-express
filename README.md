# La Pagina Perdida

E-commerce de libreria con catalogo alimentado por Google Books API, autenticacion, carrito de compras, favoritos y checkout simulado.

## Stack

| Capa | Tecnologia |
|------|-----------|
| Frontend | Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui v4 |
| Backend | Express 5 · TypeScript · Zod v4 |
| Base de datos | PostgreSQL via Supabase |
| Auth | Supabase Auth (email/password) |
| Catalogo | Google Books API con cache en DB |
| Tests | Vitest |

## Funcionalidades

- Busqueda de libros con paginacion y categorias
- Detalle de libro con portada de alta resolucion
- Carrito de compras como guest (localStorage) y autenticado (DB)
- Merge automatico del carrito guest al iniciar sesion
- Favoritos / Wishlist
- Checkout con simulacion de pago
- Dark mode con persistencia
- Skeleton loaders y toast notifications
- Validacion de inputs con Zod en todos los endpoints
- Rate limiting por IP
- 17 tests unitarios (services + middleware)

## Estructura

```
libreria/
├── frontend/          # Next.js 16
│   └── src/
│       ├── app/       # Pages (home, buscar, libro, carrito, checkout, perfil, auth)
│       ├── components/# BookCard, BookGrid, CartIcon, Navbar, Footer, etc.
│       ├── hooks/     # useAuth, useCartSync, useFavorites
│       └── lib/       # cart-store (Zustand), supabase clients, image-utils
│
└── backend/           # Express 5
    └── src/
        ├── routes/        # books, cart, favorites
        ├── controllers/   # Request handlers
        ├── services/      # Business logic + Supabase queries
        ├── schemas/       # Zod validation schemas
        └── middleware/    # auth (JWT), validate (Zod), error-handler
```

## Setup

### Prerequisitos

- Node.js 20+
- Cuenta en [Supabase](https://supabase.com) (plan gratuito)
- [Google Books API Key](https://developers.google.com/books/docs/v1/using#APIKey) (opcional, funciona sin key con rate limit menor)

### Variables de entorno

**Backend** (`backend/.env`):

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
GOOGLE_BOOKS_API_KEY=tu_api_key
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Base de datos

Ejecutar en el SQL Editor de Supabase:

```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_books_id TEXT UNIQUE,
  title TEXT NOT NULL,
  authors TEXT[] DEFAULT '{}',
  description TEXT,
  thumbnail_url TEXT,
  categories TEXT[] DEFAULT '{}',
  published_date TEXT,
  page_count INTEGER,
  isbn TEXT,
  price DECIMAL NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  book_id UUID REFERENCES books NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  book_id UUID REFERENCES books NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);
```

### Instalacion

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (otra terminal)
cd frontend
npm install
npm run dev
```

La app corre en `http://localhost:3000` y el API en `http://localhost:3001`.

### Tests

```bash
cd backend
npm test
```

## API Endpoints

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/api/books/search?q=&page=` | No | Buscar libros |
| GET | `/api/books/featured` | No | Libros destacados |
| GET | `/api/books/:id` | No | Detalle de libro |
| GET | `/api/cart` | Si | Obtener carrito |
| POST | `/api/cart` | Si | Agregar al carrito |
| PATCH | `/api/cart/:itemId` | Si | Actualizar cantidad |
| DELETE | `/api/cart/:itemId` | Si | Eliminar item |
| POST | `/api/cart/merge` | Si | Merge carrito guest |
| GET | `/api/favorites` | Si | Listar favoritos |
| POST | `/api/favorites` | Si | Agregar favorito |
| DELETE | `/api/favorites/:bookId` | Si | Eliminar favorito |

## Autor

Cristian Micchele
