import { z } from "zod/v4";

export const createOrderSchema = z.object({
  orderNumber: z.string().min(1),
  total: z.number().positive(),
  itemCount: z.number().int().min(1),
  shippingName: z.string().min(1),
  shippingEmail: z.string().email(),
  shippingAddress: z.string().min(1),
  items: z.array(
    z.object({
      bookId: z.string().uuid().nullable(),
      title: z.string().min(1),
      author: z.string().min(1),
      price: z.number().positive(),
      quantity: z.number().int().min(1),
      thumbnailUrl: z.string().nullable(),
    })
  ).min(1),
});
