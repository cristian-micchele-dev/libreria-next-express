"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";

export function CartIcon() {
  const getItemCount = useCartStore((s) => s.getItemCount);
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const count = mounted ? getItemCount() : 0;

  return (
    <Link
      href="/carrito"
      className={buttonVariants({ variant: "ghost", size: "icon" }) + " relative"}
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
