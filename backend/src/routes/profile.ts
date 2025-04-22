// src/routes/profile.ts
import { Router } from "express";
import {
  createProfile,
  getMyProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profile.controller";
import authMiddleware from "../middleware/auth.middleware"; // checks JWT

const router = Router();

router.post("/", authMiddleware, createProfile);      // Create
router.get("/", authMiddleware, getMyProfile);         // Read (self)
router.put("/", authMiddleware, updateProfile);        // Update
router.delete("/", authMiddleware, deleteProfile);     // Delete

export default router;