// src/routes/feed.ts
import { Router } from "express";
import { feedHandler } from "../controllers/feed.controller";
import { authMiddleware } from "../middleware/auth.middleware";

/**
 * Routes for managing the public feed.
 *
 * These routes allow users to:
 * - View the public feed (GET /api/feed)
 *
 * The feed route is protected by `authMiddleware`, which ensures that
 * only authenticated users can access the feed.
 */
const router = Router();

router.get("/", feedHandler); // View public feed

export default router;
