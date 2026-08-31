import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import booksRouter from "./routes/books.routes.js";
import cartRouter from "./routes/cart.routes.js";
import favoritesRouter from "./routes/favorites.routes.js";
import ordersRouter from "./routes/orders.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "16kb" }));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests, try again later" },
});

app.use("/api/", generalLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/books", booksRouter);
app.use("/api/cart", cartRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/orders", ordersRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
