import { env } from "../config/env.js";
import { supabaseAdmin } from "../config/supabase.js";
import type { Book, GoogleBooksResponse, GoogleBooksVolume, PaginatedResponse } from "../types/index.js";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";
const RESULTS_PER_PAGE = 20;

function extractIsbn(volume: GoogleBooksVolume): string | null {
  const identifiers = volume.volumeInfo.industryIdentifiers;
  if (!identifiers) return null;
  const isbn13 = identifiers.find((id) => id.type === "ISBN_13");
  const isbn10 = identifiers.find((id) => id.type === "ISBN_10");
  return isbn13?.identifier ?? isbn10?.identifier ?? null;
}

function upgradeImageUrl(url: string | null): string | null {
  if (!url) return null;
  return url
    .replace("http://", "https://")
    .replace("&edge=curl", "");
}

function generatePrice(): number {
  return Math.round((Math.random() * 25 + 5) * 100) / 100;
}

function volumeToBook(volume: GoogleBooksVolume): Omit<Book, "id" | "created_at" | "updated_at"> {
  const info = volume.volumeInfo;
  return {
    google_books_id: volume.id,
    title: info.title,
    authors: info.authors ?? [],
    description: info.description ?? null,
    thumbnail_url: upgradeImageUrl(info.imageLinks?.thumbnail ?? null),
    categories: info.categories ?? [],
    published_date: info.publishedDate ?? null,
    page_count: info.pageCount ?? null,
    isbn: extractIsbn(volume),
    price: generatePrice(),
    stock: Math.floor(Math.random() * 50) + 1,
  };
}

async function cacheBooks(volumes: GoogleBooksVolume[]): Promise<Book[]> {
  const booksToUpsert = volumes.map(volumeToBook);

  const { data, error } = await supabaseAdmin
    .from("books")
    .upsert(booksToUpsert, { onConflict: "google_books_id", ignoreDuplicates: false })
    .select();

  if (error) {
    console.error("Error caching books:", error);
    return booksToUpsert as unknown as Book[];
  }

  return data;
}

export async function searchBooks(query: string, page: number = 1): Promise<PaginatedResponse<Book>> {
  const startIndex = (page - 1) * RESULTS_PER_PAGE;

  const params = new URLSearchParams({
    q: query,
    startIndex: startIndex.toString(),
    maxResults: RESULTS_PER_PAGE.toString(),
    printType: "books",
  });

  if (env.GOOGLE_BOOKS_API_KEY) {
    params.set("key", env.GOOGLE_BOOKS_API_KEY);
  }

  const res = await fetch(`${GOOGLE_BOOKS_API}?${params}`);

  if (!res.ok) {
    throw new Error(`Google Books API error: ${res.status}`);
  }

  const json: GoogleBooksResponse = await res.json();

  if (!json.items || json.items.length === 0) {
    return { data: [], total: 0, page, totalPages: 0 };
  }

  const books = await cacheBooks(json.items);
  const totalPages = Math.ceil(json.totalItems / RESULTS_PER_PAGE);

  return { data: books, total: json.totalItems, page, totalPages };
}

export async function getBookById(id: string): Promise<Book | null> {
  const { data, error } = await supabaseAdmin
    .from("books")
    .select()
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getFeaturedBooks(limit: number = 12): Promise<Book[]> {
  const { data, error } = await supabaseAdmin
    .from("books")
    .select()
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data || data.length === 0) {
    // If no cached books, seed with popular searches
    const result = await searchBooks("bestseller ficcion", 1);
    return result.data.slice(0, limit);
  }

  return data;
}
