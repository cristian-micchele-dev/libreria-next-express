import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema } from "../schemas/orders.schema.js";
import * as ordersController from "../controllers/orders.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", ordersController.getOrders);
router.post("/", validate(createOrderSchema), ordersController.createOrder);

export default router;
