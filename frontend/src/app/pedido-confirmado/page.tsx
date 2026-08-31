"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Check, Package, Mail, ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";

interface OrderItem {
  title: string;
  author: string;
  price: number;
  quantity: number;
  thumbnail: string | null;
}

interface OrderData {
  orderNumber: string;
  items: OrderItem[];
  total: number;
  count: number;
  address: string;
  name: string;
  email: string;
}

// Cache outside React to survive Strict Mode double-mount
let cachedOrder: OrderData | null = null;

function Confetti() {
  const [particles, setParticles] = useState<
    { id: number; left: number; delay: number; duration: number; color: string; size: number }[]
  >([]);

  useEffect(() => {
    const colors = [
      "oklch(0.38 0.12 15)",  // wine
      "oklch(0.45 0.08 60)",  // warm amber
      "oklch(0.65 0.08 75)",  // warm gold
      "oklch(0.55 0.10 45)",  // accent
      "oklch(0.92 0.02 70)",  // parchment
    ];

    setParticles(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute confetti-fall"
          style={{
            left: `${p.left}%`,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            borderRadius: "1px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function OrderConfirmedPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(cachedOrder);
  const [showConfetti, setShowConfetti] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!cachedOrder) {
      const raw = sessionStorage.getItem("last-order");
      if (!raw) {
        router.push("/");
        return;
      }
      cachedOrder = JSON.parse(raw);
      sessionStorage.removeItem("last-order");
      setOrder(cachedOrder);
    }

    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up module cache when leaving the page
  useEffect(() => {
    return () => { cachedOrder = null; };
  }, []);

  if (!order) return null;

  return (
    <>
      {showConfetti && <Confetti />}

      <div className="mx-auto max-w-2xl px-6 py-16 animate-fade-in-up">
        {/* Success icon */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 animate-fade-in">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground success-pop"
              >
                <Check className="h-7 w-7" strokeWidth={3} />
              </div>
            </div>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Pedido confirmado
          </h1>
          <p className="text-muted-foreground mt-3 max-w-md">
            Gracias por tu compra, {order.name.split(" ")[0]}. Te enviamos los detalles a tu email.
          </p>
        </div>

        {/* Order number */}
        <div className="flex items-center justify-center gap-3 rounded-lg border border-border/40 bg-secondary/30 py-4 px-6 mb-8">
          <Package className="h-5 w-5 text-primary" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Numero de orden</p>
            <p
              className="text-xl font-bold text-primary font-mono tracking-wider mt-0.5"
            >
              {order.orderNumber}
            </p>
          </div>
        </div>

        {/* Order details card */}
        <div className="paper-texture rounded-xl border border-border/40 overflow-hidden mb-8">
          {/* Items */}
          <div className="p-6">
            <h2
              className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4"
            >
              Resumen del pedido
            </h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-sm book-shadow">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="h-full w-full bg-secondary flex items-center justify-center">
                        <BookOpen className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight line-clamp-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.author} &middot; Cant: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-border/40 bg-secondary/20 px-6 py-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Envio</span>
              <span className="text-accent font-medium">Gratis</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Shipping info */}
          <div className="border-t border-border/40 px-6 py-4">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="text-muted-foreground">Enviamos la confirmacion a</p>
                <p className="font-medium">{order.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 mt-3">
              <Package className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="text-muted-foreground">Direccion de envio</p>
                <p className="font-medium">{order.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/buscar"
            className={buttonVariants({ size: "lg" }) + " gap-2"}
          >
            Seguir explorando
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </>
  );
}
