"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, BookOpen, Calendar, Hash, Layers, Check } from "lucide-react";
import type { Book } from "@/types";
import { useCartStore } from "@/lib/cart-store";
import { useToastStore } from "@/lib/toast-store";
import { getHighResBookCover } from "@/lib/image-utils";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface BookDetailProps {
  book: Book;
}

export function BookDetail({ book }: BookDetailProps) {
  const { addItem, items } = useCartStore();
  const addToast = useToastStore((s) => s.addToast);
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const inCart = items.some((i) => i.book.id === book.id);
  const fav = isFavorite(book.id);

  function handleAddToCart() {
    addItem(book);
    setAdded(true);
    addToast({
      title: "Agregado al carrito",
      description: book.title,
      thumbnailUrl: book.thumbnail_url || undefined,
      href: "/carrito",
      hrefLabel: "Ver carrito",
    });
    setTimeout(() => setAdded(false), 2000);
  }

  function handleToggleFavorite() {
    if (!user) {
      addToast({
        title: "Inicia sesion",
        description: "Necesitas una cuenta para guardar favoritos",
        href: "/auth/login",
        hrefLabel: "Ingresar",
      });
      return;
    }
    toggleFavorite(book);
  }

  const coverUrl = getHighResBookCover(book.thumbnail_url);

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-12 items-start">
      {/* Cover column */}
      <div className="flex flex-col items-center gap-6 animate-slide-in-left">
        <div className="relative aspect-[2/3] w-full max-w-[380px] overflow-hidden rounded-sm book-shadow">
          {coverUrl && !imgError ? (
            <Image
              src={coverUrl}
              alt={book.title}
              fill
              className="object-cover"
              sizes="380px"
              priority
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-secondary gap-3 p-8">
              <div className="text-5xl opacity-20">📖</div>
              <span className="text-lg text-center text-muted-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {book.title}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons below cover on mobile */}
        <div className="flex gap-3 w-full lg:hidden">
          <Button size="lg" disabled={book.stock === 0} className="flex-1" onClick={handleAddToCart}>
            {added || inCart ? (
              <Check className="mr-2 h-5 w-5" />
            ) : (
              <ShoppingCart className="mr-2 h-5 w-5" />
            )}
            {added ? "Agregado" : inCart ? "En el carrito" : "Agregar al carrito"}
          </Button>
          <Button size="lg" variant="outline" onClick={handleToggleFavorite}>
            <Heart className={`h-5 w-5 ${fav ? "fill-primary text-primary" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Info column */}
      <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
        {/* Categories */}
        {book.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {book.categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="rounded-full text-xs font-normal px-3 py-1">
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {/* Title & Author */}
        <div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight editorial-rule"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {book.title}
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            por{" "}
            <span className="text-foreground font-medium">
              {book.authors.length > 0 ? book.authors.join(", ") : "Autor desconocido"}
            </span>
          </p>
        </div>

        {/* Price & Stock */}
        <div className="flex items-end gap-4 pb-2 border-b border-border/60">
          <span
            className="text-4xl font-bold text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ${book.price.toFixed(2)}
          </span>
          {book.stock > 0 ? (
            <span className="text-sm text-accent font-medium pb-1">
              {book.stock} disponibles
            </span>
          ) : (
            <Badge variant="destructive" className="mb-1">Agotado</Badge>
          )}
        </div>

        {/* Action buttons - desktop */}
        <div className="hidden lg:flex gap-3">
          <Button size="lg" disabled={book.stock === 0} className="px-8" onClick={handleAddToCart}>
            {added || inCart ? (
              <Check className="mr-2 h-5 w-5" />
            ) : (
              <ShoppingCart className="mr-2 h-5 w-5" />
            )}
            {added ? "Agregado" : inCart ? "En el carrito" : "Agregar al carrito"}
          </Button>
          <Button size="lg" variant="outline" className="px-6" onClick={handleToggleFavorite}>
            <Heart className={`mr-2 h-5 w-5 ${fav ? "fill-primary text-primary" : ""}`} />
            {fav ? "Guardado" : "Favorito"}
          </Button>
        </div>

        {/* Description */}
        {book.description && (
          <ScrollReveal>
            <div className="paper-texture rounded-lg p-6 border border-border/40">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                Sinopsis
              </h2>
              <p className="text-foreground/80 leading-[1.8] text-[15px]">
                {book.description}
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Metadata grid */}
        <ScrollReveal delay={100}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {book.page_count && (
            <div className="flex flex-col gap-1.5 rounded-lg border border-border/40 p-4">
              <BookOpen className="h-4 w-4 text-primary/60" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Paginas</span>
              <span className="text-lg font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                {book.page_count}
              </span>
            </div>
          )}
          {book.published_date && (
            <div className="flex flex-col gap-1.5 rounded-lg border border-border/40 p-4">
              <Calendar className="h-4 w-4 text-primary/60" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Publicado</span>
              <span className="text-lg font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                {book.published_date}
              </span>
            </div>
          )}
          {book.isbn && (
            <div className="flex flex-col gap-1.5 rounded-lg border border-border/40 p-4">
              <Hash className="h-4 w-4 text-primary/60" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">ISBN</span>
              <span className="text-sm font-mono font-medium truncate">{book.isbn}</span>
            </div>
          )}
          {book.categories.length > 0 && (
            <div className="flex flex-col gap-1.5 rounded-lg border border-border/40 p-4">
              <Layers className="h-4 w-4 text-primary/60" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Genero</span>
              <span className="text-sm font-medium truncate">{book.categories[0]}</span>
            </div>
          )}
        </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
