import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFrom = vi.fn();
vi.mock("../../config/supabase.js", () => ({
  supabaseAdmin: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

const favoritesService = await import("../favorites.service.js");

function createChain(resolveWith: { data: unknown; error: unknown }) {
  const handler: ProxyHandler<Record<string, unknown>> = {
    get(_target, prop) {
      if (prop === "then") {
        return (resolve: (v: unknown) => void) => resolve(resolveWith);
      }
      return vi.fn().mockReturnValue(new Proxy({}, handler));
    },
  };
  return new Proxy({}, handler);
}

describe("favorites.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFavorites", () => {
    it("should return user favorites ordered by created_at desc", async () => {
      const mockFavs = [
        { id: "fav-1", user_id: "user-1", book_id: "book-1", books: { title: "Book A" } },
      ];
      mockFrom.mockReturnValue(createChain({ data: mockFavs, error: null }));

      const result = await favoritesService.getFavorites("user-1");
      expect(mockFrom).toHaveBeenCalledWith("favorites");
      expect(result).toEqual(mockFavs);
    });

    it("should throw on supabase error", async () => {
      mockFrom.mockReturnValue(createChain({ data: null, error: new Error("DB down") }));
      await expect(favoritesService.getFavorites("user-1")).rejects.toThrow("DB down");
    });
  });

  describe("addFavorite", () => {
    it("should insert a new favorite", async () => {
      const newFav = { id: "fav-1", user_id: "user-1", book_id: "book-1" };
      mockFrom.mockReturnValue(createChain({ data: newFav, error: null }));

      const result = await favoritesService.addFavorite("user-1", "book-1");
      expect(result).toEqual(newFav);
    });

    it("should return existing favorite on duplicate (error 23505)", async () => {
      const existingFav = { id: "fav-1", user_id: "user-1", book_id: "book-1" };

      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return createChain({ data: null, error: { code: "23505", message: "duplicate" } });
        }
        return createChain({ data: existingFav, error: null });
      });

      const result = await favoritesService.addFavorite("user-1", "book-1");
      expect(result).toEqual(existingFav);
    });
  });

  describe("removeFavorite", () => {
    it("should delete a favorite", async () => {
      mockFrom.mockReturnValue(createChain({ data: null, error: null }));
      await expect(favoritesService.removeFavorite("user-1", "book-1")).resolves.toBeUndefined();
    });
  });
});
