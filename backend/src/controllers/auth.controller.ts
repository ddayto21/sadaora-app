// src/controllers/auth.controller.ts

/**
 * Handles authentication-related HTTP requests.
 *
 * This file maps authentication-related routes to service functions,
 * and manages request parsing, response formatting, and JWT-based session handling.
 */

import { Request, Response, RequestHandler } from "express";
import {
  createUser,
  deleteUser,
  loginUser,
  verifyAuthToken,
  findUserByEmail,
} from "../services/auth.service";
import { encodeToken } from "../utils/auth";
import {
  sanitizeEmail,
  sanitizePassword,
  isValidEmail,
  isStrongPassword,
} from "../utils/auth";

/**
 * Handles user signup.
 *
 * - Validates and sanitizes input
 * - Checks for duplicate emails
 * - Hashes and stores user password
 * - Returns JWT in a secure HTTP-only cookie
 */

export const signupUserHandler: RequestHandler = async (
  request,
  response
): Promise<void> => {
  const rawEmail = request.body.email;
  const rawPassword = request.body.password;

  const email = sanitizeEmail(rawEmail);
  const password = sanitizePassword(rawPassword);

  // Input validation
  if (!email || !password) {
    response.status(400).json({ error: "Email and password are required" });
  }

  if (!email) {
    response.status(400).json({ error: "Email is required" });
    return;
  }

  const isExistingUser = await findUserByEmail(email);
  if (isExistingUser) {
    response.status(409).json({ error: "Email already registered" });
    return;
  }

  if (!email || !isValidEmail(email)) {
    response.status(400).json({ error: "Invalid email format" });
  }
  if (!password || !isStrongPassword(password)) {
    response.status(400).json({
      error:
        "Password must be at least 8 characters long, contain uppercase and lowercase letters, numbers, and special characters",
    });
  }

  // Sanitize inputs
  // (e.g., trim whitespace, remove special characters)
  // Note: This is a basic example. In a real-world application, you should use a library like `validator` or `DOMPurify` for sanitization.

  // Add user to the database table
  const user = await createUser(email.trim(), password);

  // Generate JWT token
  const token = encodeToken({ userId: user.id, email: user.email });

  // Set HTTP-Only cookie
  response.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  response.status(201).json({
    id: user.id,
    email: user.email,
  });
};

/**
 * Controller for handling user login requests.
 *
 * 1. Accepts `email` and `password` from the request body.
 * 2. Validates the user credentials using the `loginUser` service.
 * 3. If valid, generates a JWT token containing the user's ID.
 * 4. Sets the token in an HttpOnly cookie to maintain the session.
 * 5. Responds with the user object and HTTP 200 status.
 * 6. If credentials are invalid, responds with 401 and an error message.
 */

export const loginUserHandler: RequestHandler = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { email, password } = request.body;
  const user = await loginUser(email, password);

  if (!user) {
    response.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const { password: _, ...safeUser } = user;
  // Destructure sensitive data

  console.log(`Generating token for user: ${user.id}`);
  // Generate JWT token
  const token = encodeToken({ userId: user.id, email: user.email });

  // Set HTTPOnly cookie
  console.log(`Setting token in HTTP-only cookie...`);
  response.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  console.log(
    `User logged in successfully: ${JSON.stringify(safeUser, null, 2)}`
  );

  response.status(200).json({
    id: user.id,
    email: user.email,
  });

  return;
};

/**
 * Controller for validating a user's authentication status.
 *
 * @route GET /api/auth/me
 *
 * This endpoint is used to determine whether a user is currently authenticated.
 *
 * How it works:
 * 1. Retrieves the JWT token from the user's cookies.
 * 2. Verifies the token using `verifyUserAuthenticated` service.
 * 3. If the token is valid, returns the user's data.
 * 4. If invalid or expired, returns a 401 Unauthorized response.
 */
export const checkAuthHandler: RequestHandler = async (req, res) => {
  console.log(`Checking whether a user is authenticated...`);
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  console.log(`Verifying token...`);
  const user = await verifyAuthToken(token);

  if (!user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  console.log(`User is authenticated: ${JSON.stringify(user, null, 2)}`);

  // Destructure sentitive data
  const { password, ...userWithoutPassword } = user;
  // Send user data without password
  res.status(200).json(userWithoutPassword);
};

/**
 * Logs out the user by clearing the JWT token cookie.
 *
 * This invalidates the session by overwriting the `token` cookie
 * with an empty value and a past expiration date.
 */
export const logoutHandler: RequestHandler = (req, res) => {
  console.log(`Logging out user...`);
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const deleterUserHandler: RequestHandler = async (req, res) => {
  console.log(`Deleting user...`);
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const isExistingUser = await findUserByEmail(email);
  if (!isExistingUser) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // Delete user from the database
  const result = await deleteUser(email);
  if (!result) {
    res.status(500).json({ error: "Failed to delete user" });
    return;
  }
  // Clear the cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "User deleted successfully" });
  return;
};
