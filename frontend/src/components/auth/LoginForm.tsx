"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";

const ERROR_MAP: Record<string, string> = {
  "Invalid login credentials": "Email o contraseña incorrectos",
  "Email not confirmed": "Revisa tu email para confirmar tu cuenta",
};

function friendlyError(message: string) {
  return ERROR_MAP[message] || "Ocurrio un error. Intenta de nuevo.";
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(friendlyError(error.message));
      setLoading(false);
      return;
    }

    router.push(returnTo);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <h1
          className="text-3xl font-bold tracking-tight editorial-rule mx-auto w-fit"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Bienvenido
        </h1>
        <p className="text-muted-foreground mt-4 text-sm">
          Ingresa a tu cuenta para continuar
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

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>

        <div className="flex justify-end">
          <Link href="/auth/recuperar" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
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
          Ingresar
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        ¿No tenes cuenta?{" "}
        <Link href="/auth/registro" className="text-primary font-medium hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  );
}
