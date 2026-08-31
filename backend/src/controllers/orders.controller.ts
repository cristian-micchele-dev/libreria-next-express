import type { Request, Response } from "express";
import * as ordersService from "../services/orders.service.js";

export async function createOrder(req: Request, res: Response) {
  const order = await ordersService.createOrder(req.userId!, req.body);
  res.status(201).json({ data: order });
}

export async function getOrders(req: Request, res: Response) {
  const orders = await ordersService.getOrders(req.userId!);
  res.json({ data: orders });
}
