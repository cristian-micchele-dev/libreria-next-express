import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { addFavoriteSchema } from "../schemas/favorites.schema.js";
import * as favoritesController from "../controllers/favorites.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", favoritesController.getFavorites);
router.post("/", validate(addFavoriteSchema), favoritesController.addFavorite);
router.delete("/:bookId", favoritesController.removeFavorite);

export default router;
