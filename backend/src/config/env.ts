import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  SUPABASE_URL: z.string().min(1, "SUPABASE_URL is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  GOOGLE_BOOKS_API_KEY: z.string().default(""),
  MERCADOPAGO_ACCESS_TOKEN: z.string().default(""),
});

export const env = envSchema.parse(process.env);
