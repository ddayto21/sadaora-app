//src/routes/auth.ts

import { Router } from "express";
import {
  signup,
  login,
  logoutHandler,
  checkAuthHandler,

} from "../controllers/auth.controller";

const router = Router();

/**
 * @route POST /api/auth/signup
 * @descr Handles user registration
 *
 *
 * 1. This route receives an HTTP POST request with `email` and `password` in the body.
 * 2. It forwards the request to the `signup` controller.
 * 3. The controller handles input validation, and delegates user creation to the `createUser` method from the `authServices`.
 * 4. The authService hashes the password, then uses the database client to add new user into PostgreSQL database.
 * 5. The controller responds with a `201 Created` status and newly created user object.
 *
 * @access Public
 */

router.post("/signup", signup);

/**
 * @route POST /api/auth/login
 * @descr Handles user login
 *
 * - This route receives an HTTP POST request with `email` and `password` in the body.
 * - It forwards the request to the `login` controller.
 * - The controller handles input validation, and delegates user verification to the `loginUser` method from the `authServices
 * - The authService checks the database for the user with the provided email and password.
 * - If the user is found, the controller responds with a `200 OK` status and the user object.
 * - If the user is not found, it responds with a `401 Unauthorized` status and an error message.
 *
 * @access Public
 */

router.post("/login", login);

/**
 * @route GET /api/auth/me
 * @descr Returns the current authenticated user
 *
 * - Reads the token from cookies
 * - Verifies it using the `verifyUser` service
 * - Responds with the user if valid, or 401 otherwise
 *
 * @access Protected (but token is checked manually, no middleware)
 */
router.get("/me", checkAuthHandler);

/**
 * @route POST /api/auth/logout
 * @descr Logs out the current user
 *
 * - Clears the authentication token cookie
 * - Returns 200 with success message
 *
 * @access Public
 */
router.post("/logout", logoutHandler);

export default router;
