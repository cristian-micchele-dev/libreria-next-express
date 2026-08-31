"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="w-full max-w-sm mx-auto text-center animate-fade-in">
        <div className="text-4xl mb-4">✉️</div>
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Revisa tu email
        </h2>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          Te enviamos un link de confirmacion a <strong>{email}</strong>.
          Hace click en el link para activar tu cuenta.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => router.push("/auth/login")}
        >
          Volver al login
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <h1
          className="text-3xl font-bold tracking-tight editorial-rule mx-auto w-fit"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Crear cuenta
        </h1>
        <p className="text-muted-foreground mt-4 text-sm">
          Unite a La Pagina Perdida y empeza a explorar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
            required
          />
        </div>

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
            placeholder="Contraseña (min. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
            minLength={6}
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
          Crear cuenta
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        ¿Ya tenes cuenta?{" "}
        <Link href="/auth/login" className="text-primary font-medium hover:underline">
          Ingresa
        </Link>
      </p>
    </div>
  );
}
