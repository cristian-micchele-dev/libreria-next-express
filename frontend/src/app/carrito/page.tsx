"use client";

import { useCartStore } from "@/lib/cart-store";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, clear } = useCartStore();
  const [mounted, setMounted] = useState(false);

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
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Tu carrito esta vacio
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Explora nuestro catalogo y agrega los libros que mas te gusten.
          </p>
          <Link
            href="/buscar"
            className={buttonVariants({ size: "lg" }) + " gap-2"}
          >
            <ArrowLeft className="h-4 w-4" />
            Explorar libros
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight editorial-rule"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Carrito
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive gap-2"
          onClick={clear}
        >
          <Trash2 className="h-4 w-4" />
          Vaciar
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-12">
        {/* Items */}
        <div>
          {items.map((item) => (
            <CartItemCard key={item.book.id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <CartSummary />
      </div>
    </div>
  );
}
