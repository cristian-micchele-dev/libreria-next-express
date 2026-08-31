"use client";

import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Lock, Loader2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

import { API_URL } from "@/lib/api";

export default function CheckoutPage() {
  const { items, getTotal, getItemCount, clear } = useCartStore();
  const { session } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="h-96 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            No hay nada para pagar
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Agrega libros a tu carrito antes de finalizar la compra.
          </p>
          <Link href="/buscar" className={buttonVariants({ size: "lg" }) + " gap-2"}>
            <ArrowLeft className="h-4 w-4" />
            Explorar libros
          </Link>
        </div>
      </div>
    );
  }

  const total = getTotal();
  const count = getItemCount();

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const isFormValid = form.name && form.email && form.address && form.city && form.zip;

  async function handlePayment() {
    if (!isFormValid) return;
    setProcessing(true);

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2500));

    const orderNumber = `LIB-${Date.now().toString(36).toUpperCase()}`;
    const address = `${form.address}, ${form.city} (${form.zip})`;

    const orderData = {
      orderNumber,
      items: items.map((i) => ({
        title: i.book.title,
        author: i.book.authors[0] || "Autor desconocido",
        price: i.book.price,
        quantity: i.quantity,
        thumbnail: i.book.thumbnail_url,
      })),
      total,
      count,
      address,
      name: form.name,
      email: form.email,
    };

    // Persist order in DB if user is logged in
    if (session?.access_token) {
      try {
        await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            orderNumber,
            total,
            itemCount: count,
            shippingName: form.name,
            shippingEmail: form.email,
            shippingAddress: address,
            items: items.map((i) => ({
              bookId: i.book.id,
              title: i.book.title,
              author: i.book.authors[0] || "Autor desconocido",
              price: i.book.price,
              quantity: i.quantity,
              thumbnailUrl: i.book.thumbnail_url,
            })),
          }),
        });
      } catch {
        // Order persistence is best-effort — don't block checkout
      }
    }

    // Store for confirmation page
    sessionStorage.setItem("last-order", JSON.stringify(orderData));

    clear();
    router.push("/pedido-confirmado");
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 animate-fade-in-up">
      <Link
        href="/carrito"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al carrito
      </Link>

      <h1
        className="text-3xl sm:text-4xl font-bold tracking-tight editorial-rule mb-10"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Checkout
      </h1>

      <div className="grid lg:grid-cols-[1fr_420px] gap-6 lg:gap-12">
        {/* Form - appears second on mobile, first on desktop */}
        <div className="space-y-8 order-2 lg:order-1">
          {/* Shipping info */}
          <section>
            <h2
              className="text-xl font-bold mb-5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Datos de envio
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm text-muted-foreground mb-1.5 block">Nombre completo</label>
                <Input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Juan Perez"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-muted-foreground mb-1.5 block">Direccion</label>
                <Input
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Av. Corrientes 1234, Piso 3"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Ciudad</label>
                <Input
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="Buenos Aires"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Codigo postal</label>
                <Input
                  value={form.zip}
                  onChange={(e) => updateField("zip", e.target.value)}
                  placeholder="1043"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-muted-foreground mb-1.5 block">Telefono (opcional)</label>
                <Input
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+54 11 1234-5678"
                />
              </div>
            </div>
          </section>

          {/* Payment simulation notice */}
          <section className="paper-texture rounded-xl border border-border/40 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3
                  className="font-semibold text-sm"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Pago seguro simulado
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Este es un proyecto de portfolio. No se realizara ningun cobro real.
                  El boton simula el flujo completo de pago.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Order summary sidebar - appears first on mobile */}
        <div className="lg:sticky lg:top-24 space-y-6 order-1 lg:order-2">
          <div className="paper-texture rounded-xl border border-border/40 p-6">
            <h2
              className="text-xl font-bold mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Tu pedido
            </h2>

            {/* Items */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.book.id} className="flex gap-3">
                  <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-sm book-shadow">
                    {item.book.thumbnail_url ? (
                      <Image
                        src={item.book.thumbnail_url}
                        alt={item.book.title}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : (
                      <div className="h-full w-full bg-secondary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight line-clamp-1">{item.book.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Cant: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold shrink-0">
                    ${(item.book.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border/40 mt-5 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({count} {count === 1 ? "libro" : "libros"})
                </span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envio</span>
                <span className="text-accent font-medium">Gratis</span>
              </div>
            </div>

            <div className="border-t border-border/40 mt-3 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full gap-2 text-base"
            disabled={!isFormValid || processing}
            onClick={handlePayment}
          >
            {processing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Procesando pago...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Pagar ${total.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
