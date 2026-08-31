import { supabaseAdmin } from "../config/supabase.js";

export async function getFavorites(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("favorites")
    .select("*, books(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addFavorite(userId: string, bookId: string) {
  const { data, error } = await supabaseAdmin
    .from("favorites")
    .insert({ user_id: userId, book_id: bookId })
    .select("*, books(*)")
    .single();

  if (error) {
    if (error.code === "23505") {
      // Already favorited — not an error
      const { data: existing } = await supabaseAdmin
        .from("favorites")
        .select("*, books(*)")
        .eq("user_id", userId)
        .eq("book_id", bookId)
        .single();
      return existing;
    }
    throw error;
  }
  return data;
}

export async function removeFavorite(userId: string, bookId: string) {
  const { error } = await supabaseAdmin
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId);

  if (error) throw error;
}
