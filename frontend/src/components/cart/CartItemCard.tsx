"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, type CartItem } from "@/lib/cart-store";
import Link from "next/link";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { book, quantity } = item;

  return (
    <div className="flex gap-4 sm:gap-6 py-6 border-b border-border/40 animate-fade-in">
      {/* Cover */}
      <Link href={`/libro/${book.id}`} className="shrink-0">
        <div className="relative h-32 w-20 sm:h-40 sm:w-28 overflow-hidden rounded-sm book-shadow">
          {book.thumbnail_url ? (
            <Image
              src={book.thumbnail_url}
              alt={book.title}
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-secondary p-2">
              <span className="text-xs text-center text-muted-foreground">{book.title}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <Link href={`/libro/${book.id}`}>
            <h3
              className="font-semibold text-base sm:text-lg leading-tight line-clamp-2 hover:text-primary transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {book.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {book.authors.length > 0 ? book.authors.join(", ") : "Autor desconocido"}
          </p>
        </div>

        <div className="flex items-end justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 sm:h-8 sm:w-8"
              onClick={() => updateQuantity(book.id, quantity - 1)}
            >
              <Minus className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
            </Button>
            <span className="w-10 text-center text-sm font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 sm:h-8 sm:w-8"
              onClick={() => updateQuantity(book.id, quantity + 1)}
              disabled={quantity >= book.stock}
            >
              <Plus className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-8 sm:w-8 text-destructive hover:text-destructive ml-1"
              onClick={() => removeItem(book.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Price */}
          <span
            className="text-lg font-bold text-primary shrink-0"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ${(book.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
