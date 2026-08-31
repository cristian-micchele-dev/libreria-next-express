"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { useCartStore } from "@/lib/cart-store";
import { api } from "@/lib/api";

export function useCartSync() {
  const { session } = useAuth();
  const merged = useRef(false);

  useEffect(() => {
    if (!session?.access_token || merged.current) return;

    const guestItems = useCartStore.getState().items;
    if (guestItems.length === 0) {
      merged.current = true;
      return;
    }

    const mergeItems = guestItems.map((i) => ({
      bookId: i.book.id,
      quantity: i.quantity,
    }));

    api("/cart/merge", {
      method: "POST",
      token: session.access_token,
      body: JSON.stringify({ items: mergeItems }),
    })
      .then(() => {
        useCartStore.getState().clear();
        merged.current = true;
      })
      .catch(console.error);
  }, [session]);
}
