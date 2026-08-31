import { BookMarked, MapPin, Clock, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookMarked className="h-4 w-4" />
              </div>
              <span className="text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                La Pagina Perdida
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Tu destino para descubrir historias que transforman.
              Cada libro, una puerta a un mundo nuevo.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-1">
              Explorar
            </h4>
            <Link href="/buscar" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Catalogo
            </Link>
            <Link href="/buscar?q=ficcion" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Ficcion
            </Link>
            <Link href="/buscar?q=no+ficcion" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              No ficcion
            </Link>
          </div>

          {/* Account */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-1">
              Tu cuenta
            </h4>
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Ingresar
            </Link>
            <Link href="/carrito" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Carrito
            </Link>
            <Link href="/perfil/pedidos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Mis pedidos
            </Link>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-1">
              Visitanos
            </h4>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Av. Corrientes 1584, CABA, Argentina</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" />
              <span>Lun a Sab, 10:00 — 21:00</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              <span>+54 11 4372-5689</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-border/40 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} La Pagina Perdida. Hecho con amor por los libros.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground/40">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/40" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/25" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/10" />
          </div>
        </div>
      </div>
    </footer>
  );
}
