-- La Pagina Perdida — Supabase schema
-- Run this in the Supabase SQL Editor to set up the database

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

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  total DECIMAL NOT NULL,
  item_count INTEGER NOT NULL,
  shipping_name TEXT NOT NULL,
  shipping_email TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES books,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price DECIMAL NOT NULL,
  quantity INTEGER NOT NULL,
  thumbnail_url TEXT
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
