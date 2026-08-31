import { Suspense } from "react";
import { BookDetail } from "@/components/books/BookDetail";
import { BookDetailSkeleton } from "@/components/books/BookDetailSkeleton";
import { BookBreadcrumbs } from "@/components/books/BookBreadcrumbs";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Book } from "@/types";

import { API_URL } from "@/lib/api";

interface BookPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}

async function getBook(id: string): Promise<Book | null> {
  const res = await fetch(`${API_URL}/books/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    return { title: "Libro no encontrado — La Pagina Perdida" };
  }

  const authors = book.authors.length > 0 ? book.authors.join(", ") : "Autor desconocido";

  return {
    title: `${book.title} — La Pagina Perdida`,
    description: book.description
      ? book.description.slice(0, 160)
      : `${book.title} por ${authors}. Disponible en La Pagina Perdida.`,
  };
}

async function BookContent({ id }: { id: string }) {
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  return <BookDetail book={book} />;
}

export default async function BookPage({ params, searchParams }: BookPageProps) {
  const { id } = await params;
  const { from } = await searchParams;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <BookBreadcrumbs searchQuery={from} />
      <Suspense fallback={<BookDetailSkeleton />}>
        <BookContent id={id} />
      </Suspense>
    </div>
  );
}
