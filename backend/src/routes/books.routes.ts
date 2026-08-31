import { Router } from "express";
import { search, getById, featured } from "../controllers/books.controller.js";

const router = Router();

router.get("/search", search);
router.get("/featured", featured);
router.get("/:id", getById);

export default router;
