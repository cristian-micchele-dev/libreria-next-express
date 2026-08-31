import { describe, it, expect, beforeEach, vi } from "vitest";
import { useToastStore } from "../toast-store";

describe("toast-store", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
    vi.useFakeTimers();
  });

  it("should add a toast", () => {
    useToastStore.getState().addToast({ title: "Added to cart" });

    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].title).toBe("Added to cart");
  });

  it("should assign unique IDs to toasts", () => {
    useToastStore.getState().addToast({ title: "Toast 1" });
    useToastStore.getState().addToast({ title: "Toast 2" });

    const { toasts } = useToastStore.getState();
    expect(toasts[0].id).not.toBe(toasts[1].id);
  });

  it("should auto-dismiss after 4 seconds", () => {
    useToastStore.getState().addToast({ title: "Bye" });

    expect(useToastStore.getState().toasts).toHaveLength(1);

    vi.advanceTimersByTime(4000);

    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("should manually remove a toast", () => {
    useToastStore.getState().addToast({ title: "Remove me" });
    const id = useToastStore.getState().toasts[0].id;

    useToastStore.getState().removeToast(id);

    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("should support optional fields", () => {
    useToastStore.getState().addToast({
      title: "Book added",
      description: "1984 by Orwell",
      thumbnailUrl: "https://example.com/cover.jpg",
      href: "/carrito",
      hrefLabel: "Ver carrito",
    });

    const toast = useToastStore.getState().toasts[0];
    expect(toast.description).toBe("1984 by Orwell");
    expect(toast.href).toBe("/carrito");
    expect(toast.hrefLabel).toBe("Ver carrito");
  });
});
