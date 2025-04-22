/**
 * Middleware to verify user authentication.
 *
 * This function checks if a user is logged in by looking for a token
 * (stored as a cookie) in the incoming request. If a valid token is found,
 * it confirms the user's identity and allows them to access protected features.
 * If not, the request is blocked and a 401 Unauthorized error is returned.
 *
 * Ultimately, this middleware serves as a front gate—only letting in users
 * who are safely signed in.
 */

// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Authentication token missing" });
    return;
  }

  try {
    const payload = verifyToken(token);
    // Attahch the user id to the request object
    req.user = { id: payload.userId };
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
