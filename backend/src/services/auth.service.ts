// src/services/auth.service.ts

import bcrypt from "bcrypt";
import databaseClient from "../db-client";
import { decodeToken } from "../utils/jwt";

/**
 * Designed to create a user profile in the postgresql database
 *
 * This services takes an email and raw password, hashes the password using bcrypt for security, and creates a new user record with prisma database client
 *
 * Called by the `signup` controller in `auth.controller.ts`.
 *
 * @param email - The user's email address
 * @param password - The user's raw (unhashed) password.
 * @returns A promise resolving to the newlyh created user object.
 */
export async function createUser(email: string, password: string) {
  const hashed = await bcrypt.hash(password, 10);
  return databaseClient.user.create({ data: { email, password: hashed } });
}

/**
 * Handles user login and password verification flow.
 *
 * Looks up the user by email, and compares the provided password
 * with the hashed password stored in the database.
 *
 * Called by the `login` controller in `auth.controller.ts`
 *
 * @param email - The user's email address
 * @param password - The raw password submit by the user.
 * @returns The user object if credentials are valid, otherwise null
 */

export async function loginUser(email: string, password: string) {
  const user = await databaseClient.user.findUnique({
    where: { email },
  });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

/** Prevents duplicate users by checking if emamil already registered */
export async function findUserByEmail(email: string) {
  const user = await databaseClient.user.findUnique({
    where: { email },
  });
  return user;
}

/**
 * Verifies if a user is authenticated by validating the JWT token.
 *
 * Reads the JWT token from the provided cookie string, verifies its signature,
 * and uses the decoded payload to look up the user in the database.
 *
 * Called by the `verify` controller (e.g. in `/api/auth/me`) to check
 * if the request is coming from a valid, logged-in user.
 *
 * @param token - The JWT string (typically extracted from req.cookies.token)
 * @returns The user object if the token is valid, otherwise null
 */

export async function getUser(token: string) {
  try {
    const decoded = decodeToken(token);
    const user = await databaseClient.user.findUnique({
      where: { id: decoded.userId },
    });
    return user || null;
  } catch (error) {
    return null;
  }
}

// TODO: Add service to handle user logout

/**
 * Handles user logout by clearing the JWT token cookie.
 *
 * This is typically called when the user clicks "Logout" in the UI,
 * and it removes the token from the client's cookies, effectively
 * logging them out.
 *
 * @param response - The Express response object to set the cookie
 */
