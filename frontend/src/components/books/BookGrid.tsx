import { BookCard } from "./BookCard";
import { BookX } from "lucide-react";
import type { Book } from "@/types";

interface BookGridProps {
  books: Book[];
  searchQuery?: string;
}

export function BookGrid({ books, searchQuery }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <BookX className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <p className="text-xl" style={{ fontFamily: "var(--font-heading)" }}>
          No se encontraron libros
        </p>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          Proba con otro titulo, autor o genero. Tenemos miles de libros esperandote.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
      {books.map((book, i) => (
        <BookCard key={book.id} book={book} index={i} searchQuery={searchQuery} />
      ))}
    </div>
  );
}
