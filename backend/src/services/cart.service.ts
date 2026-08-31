import { supabaseAdmin } from "../config/supabase.js";

export interface CartItemRow {
  id: string;
  user_id: string;
  book_id: string;
  quantity: number;
  books: {
    id: string;
    google_books_id: string;
    title: string;
    authors: string[];
    description: string | null;
    thumbnail_url: string | null;
    categories: string[];
    published_date: string | null;
    page_count: number | null;
    isbn: string | null;
    price: number;
    stock: number;
  };
}

export async function getCart(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("cart_items")
    .select("*, books(*)")
    .eq("user_id", userId);

  if (error) throw error;
  return data as CartItemRow[];
}

export async function addToCart(userId: string, bookId: string, quantity: number) {
  const { data: existing } = await supabaseAdmin
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .single();

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
      .select("*, books(*)")
      .single();

    if (error) throw error;
    return data as CartItemRow;
  }

  const { data, error } = await supabaseAdmin
    .from("cart_items")
    .insert({ user_id: userId, book_id: bookId, quantity })
    .select("*, books(*)")
    .single();

  if (error) throw error;
  return data as CartItemRow;
}

export async function updateCartItem(userId: string, itemId: string, quantity: number) {
  const { data, error } = await supabaseAdmin
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .eq("user_id", userId)
    .select("*, books(*)")
    .single();

  if (error) throw error;
  return data as CartItemRow;
}

export async function removeCartItem(userId: string, itemId: string) {
  const { error } = await supabaseAdmin
    .from("cart_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function mergeCart(userId: string, guestItems: { bookId: string; quantity: number }[]) {
  for (const item of guestItems) {
    await addToCart(userId, item.bookId, item.quantity);
  }
  return getCart(userId);
}
