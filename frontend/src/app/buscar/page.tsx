import { BookGrid } from "@/components/books/BookGrid";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, BookOpen } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import type { Book, PaginatedResponse } from "@/types";

import { API_URL } from "@/lib/api";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string; cat?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q;

  if (!query) {
    return { title: "Buscar libros — La Pagina Perdida" };
  }

  return {
    title: `"${query}" — Buscar en La Pagina Perdida`,
    description: `Resultados de busqueda para "${query}" en La Pagina Perdida.`,
  };
}

async function searchBooks(query: string, page: number, category?: string): Promise<PaginatedResponse<Book>> {
  const params = new URLSearchParams({ q: query, page: page.toString() });
  if (category) params.set("cat", category);

  const res = await fetch(
    `${API_URL}/books/search?${params}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return { data: [], total: 0, page: 1, totalPages: 0 };
  }

  return res.json();
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const page = parseInt(params.page || "1");
  const category = params.cat;
  const isExploring = !query;
  const searchQuery = query || "libros";

  const result = await searchBooks(searchQuery, page, category);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Search header */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-3 text-muted-foreground text-sm mb-2">
          <BookOpen className="h-4 w-4" />
          <span>{result.total.toLocaleString()} resultados</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight editorial-rule"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {isExploring ? "Catalogo" : <>&ldquo;{query}&rdquo;</>}
        </h1>
        {isExploring && (
          <div className="flex flex-wrap gap-2 mt-6">
            {["Gabriel Garcia Marquez", "Borges", "Cortazar", "Stephen King"].map((suggestion) => (
              <Link
                key={suggestion}
                href={`/buscar?q=${encodeURIComponent(suggestion)}`}
                className="rounded-full border border-border/60 bg-background px-4 py-2 text-sm text-foreground/70 transition-all hover:border-primary/30 hover:text-primary"
              >
                {suggestion}
              </Link>
            ))}
          </div>
        )}
      </div>

      <BookGrid books={result.data} searchQuery={isExploring ? undefined : query} />

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-14 pt-8 border-t border-border/40">
          {page > 1 ? (
            <Link
              href={`/buscar?${query ? `q=${encodeURIComponent(query)}&` : ""}page=${page - 1}`}
              className={buttonVariants({ variant: "ghost" }) + " gap-1"}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Link>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <span
              className="text-2xl font-bold text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {page}
            </span>
            <span className="text-muted-foreground text-sm">de {result.totalPages}</span>
          </div>

          {page < result.totalPages ? (
            <Link
              href={`/buscar?${query ? `q=${encodeURIComponent(query)}&` : ""}page=${page + 1}`}
              className={buttonVariants({ variant: "ghost" }) + " gap-1"}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}
