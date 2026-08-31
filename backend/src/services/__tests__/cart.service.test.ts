import { describe, it, expect, vi, beforeEach } from "vitest";

// Chainable mock for Supabase query builder
function createQueryMock(resolveWith: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {};
  const methods = ["from", "select", "insert", "update", "delete", "eq", "order", "single"];
  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain);
  }
  // Terminal methods resolve with data
  chain["single"] = vi.fn().mockResolvedValue(resolveWith);
  // Non-single selects also resolve
  chain["eq"] = vi.fn().mockImplementation(() => {
    const eqChain = { ...chain };
    // After last eq, if no .single(), resolve the promise
    eqChain["then"] = (resolve: (v: unknown) => void) => resolve(resolveWith);
    return eqChain;
  });
  return chain;
}

// Mock supabase before importing service
const mockFrom = vi.fn();
vi.mock("../../config/supabase.js", () => ({
  supabaseAdmin: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

// Import AFTER mocking
const cartService = await import("../cart.service.js");

describe("cart.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCart", () => {
    it("should return cart items for a user", async () => {
      const mockItems = [
        { id: "item-1", user_id: "user-1", book_id: "book-1", quantity: 2, books: { title: "Test Book" } },
      ];

      const chain = createChain({ data: mockItems, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await cartService.getCart("user-1");

      expect(mockFrom).toHaveBeenCalledWith("cart_items");
      expect(result).toEqual(mockItems);
    });

    it("should throw when supabase returns an error", async () => {
      const chain = createChain({ data: null, error: new Error("DB error") });
      mockFrom.mockReturnValue(chain);

      await expect(cartService.getCart("user-1")).rejects.toThrow("DB error");
    });
  });

  describe("addToCart", () => {
    it("should insert a new cart item when item does not exist", async () => {
      const newItem = { id: "item-1", user_id: "user-1", book_id: "book-1", quantity: 1, books: { title: "Test" } };

      // First call: check existing (returns null)
      // Second call: insert new
      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return createChain({ data: null, error: null });
        }
        return createChain({ data: newItem, error: null });
      });

      const result = await cartService.addToCart("user-1", "book-1", 1);
      expect(result).toEqual(newItem);
    });

    it("should update quantity when item already exists", async () => {
      const existingItem = { id: "item-1", quantity: 2 };
      const updatedItem = { id: "item-1", user_id: "user-1", book_id: "book-1", quantity: 3, books: { title: "Test" } };

      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return createChain({ data: existingItem, error: null });
        }
        return createChain({ data: updatedItem, error: null });
      });

      const result = await cartService.addToCart("user-1", "book-1", 1);
      expect(result).toEqual(updatedItem);
    });
  });

  describe("removeCartItem", () => {
    it("should delete a cart item", async () => {
      const chain = createChain({ data: null, error: null });
      mockFrom.mockReturnValue(chain);

      await expect(cartService.removeCartItem("user-1", "item-1")).resolves.toBeUndefined();
    });
  });

  describe("mergeCart", () => {
    it("should call addToCart for each guest item then return full cart", async () => {
      const guestItems = [
        { bookId: "book-1", quantity: 1 },
        { bookId: "book-2", quantity: 2 },
      ];
      const finalCart = [
        { id: "item-1", book_id: "book-1", quantity: 1 },
        { id: "item-2", book_id: "book-2", quantity: 2 },
      ];

      // Each addToCart makes 2 from() calls (check existing + insert), then getCart makes 1
      // Total: 2 + 2 + 1 = 5 calls
      mockFrom.mockImplementation(() => {
        return createChain({ data: null, error: null });
      });

      // Override final getCart call to return the full cart
      let fromCallCount = 0;
      mockFrom.mockImplementation(() => {
        fromCallCount++;
        // Calls 1,2 = addToCart for item 1 (check + insert)
        // Calls 3,4 = addToCart for item 2 (check + insert)
        // Call 5 = getCart
        if (fromCallCount === 5) {
          return createChain({ data: finalCart, error: null });
        }
        return createChain({ data: null, error: null });
      });

      const result = await cartService.mergeCart("user-1", guestItems);
      expect(result).toEqual(finalCart);
      expect(fromCallCount).toBe(5);
    });
  });
});

/**
 * Creates a full chainable mock that resolves at any terminal point.
 * Supports: from().select().eq().eq() and from().insert().select().single()
 */
function createChain(resolveWith: { data: unknown; error: unknown }) {
  const handler: ProxyHandler<Record<string, unknown>> = {
    get(_target, prop) {
      if (prop === "then") {
        // Make it thenable — resolves with the data
        return (resolve: (v: unknown) => void) => resolve(resolveWith);
      }
      // Any method call returns the same proxy
      return vi.fn().mockReturnValue(new Proxy({}, handler));
    },
  };

  return new Proxy({}, handler);
}
