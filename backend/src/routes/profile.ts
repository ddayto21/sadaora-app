// src/routes/profile.ts
import { Router } from "express";
import {
  createHandler,
  readHandler,
  updateHandler,
  deleteHandler,
} from "../controllers/profile.controller";
import { authMiddleware } from "../middleware/auth.middleware";

/**
 * Routes for managing the authenticated user's profile.
 *
 * These routes allow a logged-in user to:
 * - Create their profile (POST /api/profile)
 * - View their existing profile (GET /api/profile)
 * - Update profile details (PUT /api/profile)
 * - Delete their profile (DELETE /api/profile)
 *
 * All routes are protected by `authMiddleware`, which ensures that
 * only authenticated users can access or modify their own profile.
 */

const router = Router();

router.post("/", authMiddleware, createHandler); // Create user profile
router.get("/", authMiddleware, readHandler); // Read user profile
router.put("/", authMiddleware, updateHandler); // Update user profile
router.delete("/", authMiddleware, deleteHandler); // Delete user profile

export default router;
