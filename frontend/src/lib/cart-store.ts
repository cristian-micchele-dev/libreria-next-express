"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "@/types";

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (book: Book, quantity?: number) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clear: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (book, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.book.id === book.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.book.id === book.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, i.book.stock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { book, quantity }] };
        });
      },

      removeItem: (bookId) => {
        set((state) => ({
          items: state.items.filter((i) => i.book.id !== bookId),
        }));
      },

      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.book.id === bookId
              ? { ...i, quantity: Math.min(quantity, i.book.stock) }
              : i
          ),
        }));
      },

      clear: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.book.price * i.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "la-pagina-perdida-cart",
    }
  )
);
