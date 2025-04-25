// src/services/auth.service.ts

import bcrypt from "bcrypt";
import databaseClient from "../db-client";
import { decodeToken } from "../utils/auth";
import type { User } from "@prisma/client";

/**
 * Creates a new user with a securely hashed password.
 * @param email - The user's email address.
 * @param password - The raw password (to be hashed).
 * @returns The created user object.
 */
export async function createUser(
  email: string,
  password: string
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);
  return databaseClient.user.create({
    data: { email, password: hashedPassword },
  });
}

/**
 * Deletes a user by email.
 * @param email - The email of the user to delete.
 * @returns The deleted user object.
 */
export async function deleteUser(email: string): Promise<User | null> {
  try {
    return await databaseClient.user.delete({
      where: { email },
    });
  } catch (error) {
    console.error(`Error deleting user with email ${email}:`, error);
    return null;
  }
}

/**
 * Finds a user by email.
 * @param email - The email to search for.
 * @returns The found user object, or null if not found.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  return databaseClient.user.findUnique({ where: { email } });
}

/**
 * Authenticates a user by verifying their email and password.
 * @param email - The user's email.
 * @param password - The raw password to validate.
 * @returns The user object if valid, otherwise null.
 */

export async function loginUser(
  email: string,
  password: string
): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
}

/**
 * Verifies a user's identity based on their JWT token.
 * @param token - The JWT string from the client.
 * @returns The authenticated user object, or null if invalid.
 */

export async function verifyAuthToken(token: string): Promise<User | null> {
  try {
    const decoded = decodeToken(token);
    return await databaseClient.user.findUnique({
      where: { id: decoded.userId },
    });
  } catch {
    return null;
  }
}

/**
 * Retrieves all users.
 * @returns An array of all user records.
 */
export async function getAllUsers(): Promise<User[]> {
  return databaseClient.user.findMany();
}
