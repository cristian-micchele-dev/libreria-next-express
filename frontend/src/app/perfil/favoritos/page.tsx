"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { BookGrid } from "@/components/books/BookGrid";
import { BookGridSkeleton } from "@/components/books/BookGridSkeleton";
import { Heart } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { favorites, loading } = useFavorites();

  if (authLoading || loading) {
    return <BookGridSkeleton count={6} />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center text-center py-16 animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
          <Heart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Tus favoritos te esperan
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Inicia sesion para guardar tus libros favoritos y encontrarlos siempre aca.
        </p>
        <Link href="/auth/login" className={buttonVariants({ size: "lg" })}>
          Ingresar
        </Link>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-16 animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
          <Heart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Aun no tenes favoritos
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Explora el catalogo y toca el corazon en los libros que te gusten.
        </p>
        <Link href="/buscar" className={buttonVariants({ size: "lg" })}>
          Explorar libros
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <p className="text-sm text-muted-foreground mb-6">
        {favorites.length} {favorites.length === 1 ? "libro guardado" : "libros guardados"}
      </p>
      <BookGrid books={favorites} />
    </div>
  );
}
