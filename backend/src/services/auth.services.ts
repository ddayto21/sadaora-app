// src/services/auth.services.ts

import bcrypt from "bcrypt";
import databaseClient from "../db-client";

/**
 * Handles password hasing and user creation in the postgresql database
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
 * Verifies user credentials for login.
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

export async function verifyUser(email: string, password: string) {
  const user = await databaseClient.user.findUnique({
    where: { email },
  });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}
