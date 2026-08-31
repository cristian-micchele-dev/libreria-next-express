"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { api } from "@/lib/api";
import type { Book } from "@/types";

interface FavoriteRow {
  id: string;
  book_id: string;
  books: Book;
}

export function useFavorites() {
  const { session } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await api<{ data: FavoriteRow[] }>("/favorites", {
        token: session.access_token,
      });
      setFavorites(res.data.map((f) => f.books));
      setFavoriteIds(new Set(res.data.map((f) => f.book_id)));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(
    async (book: Book) => {
      if (!session?.access_token) return false;

      const isFav = favoriteIds.has(book.id);

      // Optimistic update
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFav) {
          next.delete(book.id);
        } else {
          next.add(book.id);
        }
        return next;
      });

      if (isFav) {
        setFavorites((prev) => prev.filter((f) => f.id !== book.id));
      } else {
        setFavorites((prev) => [book, ...prev]);
      }

      try {
        if (isFav) {
          await api(`/favorites/${book.id}`, {
            method: "DELETE",
            token: session.access_token,
          });
        } else {
          await api("/favorites", {
            method: "POST",
            token: session.access_token,
            body: JSON.stringify({ bookId: book.id }),
          });
        }
        return true;
      } catch {
        // Revert on error
        fetchFavorites();
        return false;
      }
    },
    [session?.access_token, favoriteIds, fetchFavorites]
  );

  const isFavorite = useCallback(
    (bookId: string) => favoriteIds.has(bookId),
    [favoriteIds]
  );

  return { favorites, favoriteIds, loading, isFavorite, toggleFavorite };
}
