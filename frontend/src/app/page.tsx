import { buttonVariants } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { BookGrid } from "@/components/books/BookGrid";
import { Search, ArrowRight, BookMarked, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { Book } from "@/types";

import { API_URL } from "@/lib/api";

async function getFeaturedBooks(): Promise<Book[]> {
  try {
    const res = await fetch(`${API_URL}/books/featured`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const featuredBooks = await getFeaturedBooks();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 80px,
            currentColor 80px,
            currentColor 81px
          )`
        }} />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:py-36">
          <div className="flex flex-col items-start gap-8 max-w-2xl">
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Miles de titulos disponibles</span>
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] animate-fade-in-up"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Donde cada
              <br />
              <span className="text-primary italic">pagina</span>
              <br />
              cuenta
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Explora nuestra coleccion curada de libros. Desde clasicos atemporales
              hasta las ultimas novedades — tu proxima gran lectura te espera.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <Link href="/buscar" className={buttonVariants({ size: "lg" }) + " gap-2 px-6"}>
                <Search className="h-4 w-4" />
                Explorar catalogo
              </Link>
              <Link
                href="/buscar?q=bestseller"
                className={buttonVariants({ variant: "outline", size: "lg" }) + " gap-2 px-6"}
              >
                <TrendingUp className="h-4 w-4" />
                Mas vendidos
              </Link>
            </div>
          </div>

          {/* Decorative book icon */}
          <div className="absolute right-8 bottom-8 opacity-[0.04] hidden lg:block">
            <BookMarked className="h-80 w-80" strokeWidth={0.5} />
          </div>
        </div>
      </section>

      {/* Categories quick access */}
      <ScrollReveal>
        <section className="border-b border-border/40 bg-secondary/20">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              <span className="text-sm font-medium text-muted-foreground shrink-0">Explorar:</span>
              {["Ficcion", "No ficcion", "Ciencia", "Historia", "Poesia", "Infantil", "Filosofia", "Arte", "Terror", "Romance", "Fantasia", "Biografia", "Psicologia", "Economia", "Programacion"].map((cat) => (
                <Link
                  key={cat}
                  href={`/buscar?q=${encodeURIComponent(cat.toLowerCase())}`}
                  className="shrink-0 rounded-full border border-border/60 bg-background px-4 py-1.5 text-sm text-foreground/80 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Featured books */}
      {featuredBooks.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2
                  className="text-3xl sm:text-4xl font-bold tracking-tight editorial-rule"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Libros destacados
                </h2>
                <p className="text-muted-foreground mt-4 text-sm">
                  Nuestra seleccion de titulos imperdibles
                </p>
              </div>
              <Link
                href="/buscar"
                className="hidden sm:flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all font-medium"
              >
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <BookGrid books={featuredBooks} />
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex justify-center mt-10 sm:hidden">
              <Link
                href="/buscar"
                className={buttonVariants({ variant: "outline" }) + " gap-2"}
              >
                Ver todos los libros
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </section>
      )}
    </div>
  );
}
