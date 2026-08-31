import type { Request, Response } from "express";
import * as cartService from "../services/cart.service.js";

export async function getCart(req: Request, res: Response) {
  const items = await cartService.getCart(req.userId!);
  res.json({ data: items });
}

export async function addToCart(req: Request, res: Response) {
  const { bookId, quantity } = req.body;
  const item = await cartService.addToCart(req.userId!, bookId, quantity);
  res.status(201).json({ data: item });
}

export async function updateCartItem(req: Request, res: Response) {
  const itemId = req.params.itemId as string;
  const { quantity } = req.body;
  const item = await cartService.updateCartItem(req.userId!, itemId, quantity);
  res.json({ data: item });
}

export async function removeCartItem(req: Request, res: Response) {
  const itemId = req.params.itemId as string;
  await cartService.removeCartItem(req.userId!, itemId);
  res.status(204).end();
}

export async function mergeCart(req: Request, res: Response) {
  const { items } = req.body;
  const cart = await cartService.mergeCart(req.userId!, items);
  res.json({ data: cart });
}
