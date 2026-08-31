import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "../cart-store";
import type { Book } from "@/types";

function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    id: "book-1",
    google_books_id: "gbook-1",
    title: "Test Book",
    authors: ["Author"],
    description: null,
    thumbnail_url: null,
    categories: [],
    published_date: null,
    page_count: null,
    isbn: null,
    price: 15.99,
    stock: 10,
    ...overrides,
  };
}

describe("cart-store", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  describe("addItem", () => {
    it("should add a new item to the cart", () => {
      const book = makeBook();
      useCartStore.getState().addItem(book);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].book.id).toBe("book-1");
      expect(items[0].quantity).toBe(1);
    });

    it("should increment quantity when adding existing item", () => {
      const book = makeBook();
      useCartStore.getState().addItem(book);
      useCartStore.getState().addItem(book);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it("should cap quantity at stock limit when adding to existing", () => {
      const book = makeBook({ stock: 3 });
      useCartStore.getState().addItem(book, 2);
      useCartStore.getState().addItem(book, 5);

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(3);
    });

    it("should respect custom quantity", () => {
      const book = makeBook();
      useCartStore.getState().addItem(book, 4);

      expect(useCartStore.getState().items[0].quantity).toBe(4);
    });
  });

  describe("removeItem", () => {
    it("should remove an item by bookId", () => {
      const book1 = makeBook({ id: "book-1" });
      const book2 = makeBook({ id: "book-2", title: "Book 2" });
      useCartStore.getState().addItem(book1);
      useCartStore.getState().addItem(book2);

      useCartStore.getState().removeItem("book-1");

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].book.id).toBe("book-2");
    });
  });

  describe("updateQuantity", () => {
    it("should update quantity of an item", () => {
      const book = makeBook();
      useCartStore.getState().addItem(book);
      useCartStore.getState().updateQuantity("book-1", 5);

      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });

    it("should remove item when quantity is 0 or less", () => {
      const book = makeBook();
      useCartStore.getState().addItem(book);
      useCartStore.getState().updateQuantity("book-1", 0);

      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it("should cap at stock limit", () => {
      const book = makeBook({ stock: 5 });
      useCartStore.getState().addItem(book);
      useCartStore.getState().updateQuantity("book-1", 99);

      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });
  });

  describe("clear", () => {
    it("should remove all items", () => {
      useCartStore.getState().addItem(makeBook({ id: "1" }));
      useCartStore.getState().addItem(makeBook({ id: "2" }));
      useCartStore.getState().clear();

      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("getTotal", () => {
    it("should calculate total price", () => {
      useCartStore.getState().addItem(makeBook({ id: "1", price: 10 }));
      useCartStore.getState().addItem(makeBook({ id: "2", price: 20 }), 2);

      expect(useCartStore.getState().getTotal()).toBe(50);
    });

    it("should return 0 for empty cart", () => {
      expect(useCartStore.getState().getTotal()).toBe(0);
    });
  });

  describe("getItemCount", () => {
    it("should count total items including quantities", () => {
      useCartStore.getState().addItem(makeBook({ id: "1" }), 3);
      useCartStore.getState().addItem(makeBook({ id: "2" }), 2);

      expect(useCartStore.getState().getItemCount()).toBe(5);
    });
  });
});
