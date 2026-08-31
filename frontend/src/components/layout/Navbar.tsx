"use client";

import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { Button, buttonVariants } from "@/components/ui/button";
import { User, BookMarked, LogOut } from "lucide-react";
import { CartIcon } from "@/components/cart/CartIcon";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useCartSync } from "@/hooks/useCartSync";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  useCartSync();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 sm:h-18 max-w-7xl items-center gap-2 sm:gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:rotate-[-3deg]">
            <BookMarked className="h-5 w-5" />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-lg tracking-wide" style={{ fontFamily: "var(--font-heading)" }}>
              La Pagina Perdida
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Libros & mas
            </span>
          </div>
        </Link>

        <div className="flex-1 flex justify-center px-2 sm:px-4">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-1 shrink-0">
          <ThemeToggle />
          <CartIcon />
          <div className="hidden sm:block h-6 w-px bg-border mx-1" />
          {!loading && user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/perfil"
                className={buttonVariants({ variant: "ghost", size: "icon" }) + " sm:!w-auto sm:!px-3 sm:gap-2 sm:text-sm"}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                </div>
                <span className="hidden md:inline max-w-24 truncate">
                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </span>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout} title="Cerrar sesion">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className={buttonVariants({ variant: "ghost", size: "icon" }) + " sm:!w-auto sm:!px-3 sm:gap-2 sm:text-sm"}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Ingresar</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
