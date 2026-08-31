"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function CartSummary() {
  const { getTotal, getItemCount } = useCartStore();
  const total = getTotal();
  const count = getItemCount();

  return (
    <div className="paper-texture rounded-xl border border-border/40 p-6 lg:sticky lg:top-24">
      <h2
        className="text-xl font-bold mb-6"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Resumen del pedido
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal ({count} {count === 1 ? "libro" : "libros"})
          </span>
          <span className="font-medium">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Envio</span>
          <span className="text-accent font-medium">Gratis</span>
        </div>
      </div>

      <div className="border-t border-border/60 my-4" />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-primary" style={{ fontFamily: "var(--font-heading)" }}>
          ${total.toFixed(2)}
        </span>
      </div>

      <Link
        href="/checkout"
        className={buttonVariants({ size: "lg" }) + " w-full mt-6 gap-2"}
      >
        <ShoppingBag className="h-5 w-5" />
        Finalizar compra
      </Link>
    </div>
  );
}
