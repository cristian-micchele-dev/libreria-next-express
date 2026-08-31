"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, User, Calendar } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center text-center py-16 animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
          <User className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Inicia sesion
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Accede a tu cuenta para ver tus favoritos, historial de pedidos y mas.
        </p>
        <Link href="/auth/login" className={buttonVariants({ size: "lg" })}>
          Ingresar
        </Link>
      </div>
    );
  }

  const name = user.user_metadata?.full_name || "Usuario";
  const email = user.email || "";
  const createdAt = new Date(user.created_at).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-xl animate-fade-in">
      <div className="paper-texture rounded-xl border border-border/40 p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {name[0].toUpperCase()}
          </div>
          <div>
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {name}
            </h2>
            <p className="text-sm text-muted-foreground">Miembro de La Pagina Perdida</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Miembro desde {createdAt}</span>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-6">
          <Button variant="outline" className="gap-2 text-destructive hover:text-destructive" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </Button>
        </div>
      </div>
    </div>
  );
}
