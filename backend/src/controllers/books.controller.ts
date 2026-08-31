import type { Request, Response } from "express";
import { searchBooks, getBookById, getFeaturedBooks } from "../services/google-books.service.js";

export async function search(req: Request, res: Response) {
  const query = req.query.q as string;
  const page = parseInt(req.query.page as string) || 1;

  if (!query || query.trim().length === 0) {
    res.status(400).json({ error: "Query parameter 'q' is required" });
    return;
  }

  try {
    const result = await searchBooks(query.trim(), page);
    res.json(result);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to search books" });
  }
}

export async function getById(req: Request, res: Response) {
  const id = req.params.id as string;

  try {
    const book = await getBookById(id);

    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    res.json(book);
  } catch (err) {
    console.error("Get book error:", err);
    res.status(500).json({ error: "Failed to get book" });
  }
}

export async function featured(_req: Request, res: Response) {
  try {
    const books = await getFeaturedBooks();
    res.json(books);
  } catch (err) {
    console.error("Featured books error:", err);
    res.status(500).json({ error: "Failed to get featured books" });
  }
}
