import { z } from "zod/v4";

export const addFavoriteSchema = z.object({
  bookId: z.string().uuid(),
});
