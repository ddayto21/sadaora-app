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
import { decodeToken } from "../utils/jwt";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(`[authMiddleware] Request received: ${req.method} ${req.url}`);

  // Check if the request has a token in cookies
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Authentication token missing" });
    return;
  }

  console.log(`[authMiddleware] Token: ${JSON.stringify(token, null, 2)}`);
  try {
    const payload = decodeToken(token);
    console.log(
      `[authMiddleware] Decoded token payload: ${JSON.stringify(
        payload,
        null,
        2
      )}`
    );
    // Attach the userId to the request object
    req.user = {
      userId: payload.userId,
      // Add other properties if needed
    };
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
