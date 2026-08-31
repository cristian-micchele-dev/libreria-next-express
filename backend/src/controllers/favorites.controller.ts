import type { Request, Response } from "express";
import * as favoritesService from "../services/favorites.service.js";

export async function getFavorites(req: Request, res: Response) {
  const data = await favoritesService.getFavorites(req.userId!);
  res.json({ data });
}

export async function addFavorite(req: Request, res: Response) {
  const { bookId } = req.body;
  const data = await favoritesService.addFavorite(req.userId!, bookId);
  res.status(201).json({ data });
}

export async function removeFavorite(req: Request, res: Response) {
  const bookId = req.params.bookId as string;
  await favoritesService.removeFavorite(req.userId!, bookId);
  res.status(204).end();
}
