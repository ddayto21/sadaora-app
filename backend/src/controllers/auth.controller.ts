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
  loginUser,
  getUser,
  findUserByEmail,
} from "../services/auth.service";
import { encodeToken } from "../utils/jwt";
import { isValidEmail } from "../utils/auth";

/**
 * Handles user signup requests.
 *
 * 1. Accepts `email` and `password` from the request body.
 * 2. Validates the input fields (email format, required fields).
 * 3. Prevents duplicate users by checking if the email is already registered.
 * 4. Sanitizes inputs and takes precaution against XSS.
 * 5. Creates a new user using the `createUser` service.
 * 6. Generates a JWT token containing the user's ID.
 * 7. Stores the token in an HttpOnly cookie so the user stays logged in.
 * 8. Responds with the created user and HTTP 201 status.
 */

export const signup: RequestHandler = async (
  request,
  response
): Promise<void> => {
  const { email, password } = request.body;

  // Input validation
  if (!email || !password) {
    response.status(400).json({ error: "Email and password are required" });
  }

  if (!isValidEmail(email)) {
    response.status(400).json({ error: "Invalid email format" });
  }

  const isExistingUser = await findUserByEmail(email);
  if (isExistingUser) {
    response.status(409).json({ error: "Email already registered" });
  }

  // Add user to the database table
  const user = await createUser(email.trim(), password);

  // Generate JWT token
  const token = encodeToken({ userId: user.id });

  // Set HTTP-Only cookie
  response.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  response.status(201).json(user);
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

export const login: RequestHandler = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { email, password } = request.body;
  const user = await loginUser(email, password);

  if (!user) {
    response.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = encodeToken({ userId: user.id });

  // Set HTTPOnly cookie
  response.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  response.status(200).json(user);
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
  console.log(`Checking authentication...`);
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const user = await getUser(token);

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
