"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, ArrowLeft, BookMarked, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/nueva-password`,
    });

    setLoading(false);

    if (error) {
      setError("Ocurrio un error. Intenta de nuevo.");
      return;
    }

    setSent(true);
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookMarked className="h-7 w-7" />
          </div>
        </div>
        <div className="paper-texture rounded-xl border border-border/40 p-8">
          <div className="w-full max-w-sm mx-auto">
            {sent ? (
              <div className="text-center space-y-4 animate-fade-in">
                <div className="flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
                    <CheckCircle2 className="h-7 w-7 text-accent" />
                  </div>
                </div>
                <h1
                  className="text-2xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Revisa tu email
                </h1>
                <p className="text-sm text-muted-foreground">
                  Te enviamos un link a <strong>{email}</strong> para restablecer tu contraseña.
                </p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver al login
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1
                    className="text-3xl font-bold tracking-tight editorial-rule mx-auto w-fit"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Recuperar cuenta
                  </h1>
                  <p className="text-muted-foreground mt-4 text-sm">
                    Ingresa tu email y te enviaremos un link para restablecer tu contraseña
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                      {error}
                    </p>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Enviar link
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  <Link href="/auth/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" />
                    Volver al login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
