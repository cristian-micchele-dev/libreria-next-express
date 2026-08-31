"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2, BookMarked, CheckCircle2 } from "lucide-react";

export default function NewPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError("Ocurrio un error. Intenta de nuevo.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/"), 3000);
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
            {success ? (
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
                  Contraseña actualizada
                </h1>
                <p className="text-sm text-muted-foreground">
                  Tu contraseña fue cambiada con exito. Redirigiendo...
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1
                    className="text-3xl font-bold tracking-tight editorial-rule mx-auto w-fit"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Nueva contraseña
                  </h1>
                  <p className="text-muted-foreground mt-4 text-sm">
                    Ingresa tu nueva contraseña
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Nueva contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Confirmar contraseña"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
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
                    Cambiar contraseña
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
