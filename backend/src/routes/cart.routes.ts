import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { addToCartSchema, updateCartItemSchema, mergeCartSchema } from "../schemas/cart.schema.js";
import * as cartController from "../controllers/cart.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", cartController.getCart);
router.post("/", validate(addToCartSchema), cartController.addToCart);
router.patch("/:itemId", validate(updateCartItemSchema), cartController.updateCartItem);
router.delete("/:itemId", cartController.removeCartItem);
router.post("/merge", validate(mergeCartSchema), cartController.mergeCart);

export default router;
