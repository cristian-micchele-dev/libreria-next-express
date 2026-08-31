import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BookX, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-6">
      <div className="flex flex-col items-center text-center max-w-md animate-fade-in-up">
        <div className="relative mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
            <BookX className="h-12 w-12 text-muted-foreground/40" />
          </div>
          <span
            className="absolute -top-2 -right-4 text-7xl font-bold text-primary/10 select-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            404
          </span>
        </div>

        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight editorial-rule"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Pagina perdida
        </h1>

        <p className="text-muted-foreground mt-5 leading-relaxed">
          Ironico, ¿no? En una libreria llamada <em>La Pagina Perdida</em>,
          esta pagina realmente se perdio. Pero hay miles de otras esperandote.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link href="/" className={buttonVariants({ size: "lg" }) + " gap-2"}>
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
          <Link href="/buscar" className={buttonVariants({ variant: "outline", size: "lg" }) + " gap-2"}>
            <Search className="h-4 w-4" />
            Buscar libros
          </Link>
        </div>
      </div>
    </div>
  );
}
