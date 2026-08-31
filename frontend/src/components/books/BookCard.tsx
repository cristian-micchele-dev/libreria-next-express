"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Book } from "@/types";
import { getHighResBookCover } from "@/lib/image-utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface BookCardProps {
  book: Book;
  index?: number;
  searchQuery?: string;
}

function BookCoverFallback({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-secondary gap-2 p-4">
      <div className="text-3xl opacity-20">📖</div>
      <span className="text-xs text-center text-muted-foreground line-clamp-3" style={{ fontFamily: "var(--font-heading)" }}>
        {title}
      </span>
    </div>
  );
}

export function BookCard({ book, index = 0, searchQuery }: BookCardProps) {
  const coverUrl = getHighResBookCover(book.thumbnail_url);
  const [imgError, setImgError] = useState(false);

  const bookHref = searchQuery
    ? `/libro/${book.id}?from=${encodeURIComponent(searchQuery)}`
    : `/libro/${book.id}`;

  return (
    <ScrollReveal delay={index * 60}>
    <Link
      href={bookHref}
      className="group block"
    >
      <article className="relative">
        {/* Book cover with spine shadow */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-sm book-shadow transition-all duration-500 group-hover:translate-y-[-4px]">
          {coverUrl && !imgError ? (
            <Image
              src={coverUrl}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <BookCoverFallback title={book.title} />
          )}

          {/* Price tag overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pt-8 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            <span className="text-white font-bold text-lg">${book.price.toFixed(2)}</span>
          </div>

          {/* Stock badge */}
          {book.stock === 0 && (
            <div className="absolute top-2 right-2 rounded-full bg-destructive/90 px-2 py-0.5 text-[10px] font-medium text-white">
              Agotado
            </div>
          )}
        </div>

        {/* Book info */}
        <div className="mt-3 space-y-0.5">
          <h3
            className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {book.authors.length > 0 ? book.authors.join(", ") : "Autor desconocido"}
          </p>
          <p className="text-sm font-bold text-primary pt-1 sm:hidden">${book.price.toFixed(2)}</p>
        </div>
      </article>
    </Link>
    </ScrollReveal>
  );
}
