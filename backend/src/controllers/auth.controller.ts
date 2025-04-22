// src/controllers/auth.controller.ts

/**
 * Handles authentication-related HTTP requests.
 *
 * This file maps authentication-related routes to service functions,
 * and manages request parsing, response formatting, and JWT-based session handling.
 */

import { Request, Response, RequestHandler } from "express";
import { createUser, loginUser, verifyUser } from "../services/auth.service";
import { generateToken } from "../utils/jwt";
import { error } from "console";

/**
 * Handles user signup requests.
 *
 * 1. Accepts `email` and `password` from the request body.
 * 2. Creates a new user using the `createUser` service.
 * 3. Generates a JWT token containing the user's ID.
 * 4. Stores the token in an HttpOnly cookie so the user stays logged in.
 * 5. Responds with the created user and HTTP 201 status.
 */
export const signup: RequestHandler = async (
  request: Request,
  response: Response
) => {
  const { email, password } = request.body;
  const user = await createUser(email, password);

  const token = generateToken({ userId: user.id });

  response.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  response.status(201).json(user);
};

/**
 * Handles user login.
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
) => {
  const { email, password } = request.body;
  const user = await loginUser(email, password);

  if (!user) {
    response.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = generateToken({ userId: user.id });

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
 * Handles GET request to `/api/auth/me`.
 *
 * 1. Reads the JWT token from the cookie
 * 2. Verifies the token using `verifyUser`
 * 3. Returns the user if valid, or 401 if not authenticated
 */
export const getCurrentUser: RequestHandler = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const user = await verifyUser(token);

  if (!user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  res.status(200).json(user);
};
