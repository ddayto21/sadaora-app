//src/routes/auth.ts

import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";

/**
 * @route POST /api/auth/signup
 * @descr Handles user registration
 *
 * Data Flow Overview:
 *
 * 1. This route receives an HTTP POST request iwth `email` and `password` in the body.
 * 2. It forwards the request to the `signup` controller.
 * 3. The controller handles input validation, and delegates user creation to the `authServices.createUser` method.
 * 4. The authService hashes the password, then uses the database client to add new user into PostgreSQL database.
 * 5. The controller responds with a `201 Created` status and newly created user object.
 *
 * @access Public
 */

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
