import { z } from "zod/v4";

export const addToCartSchema = z.object({
  bookId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(10),
});

export const mergeCartSchema = z.object({
  items: z.array(
    z.object({
      bookId: z.string().uuid(),
      quantity: z.number().int().min(1).max(10),
    })
  ),
});
