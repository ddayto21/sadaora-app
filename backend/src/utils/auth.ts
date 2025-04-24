import jwt from "jsonwebtoken";
import validator from "validator";
import type { AuthTokenPayload } from "../interfaces/auth";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";

/**
 * Generates a signed JWT (JSON Web Token) with the given payload.
 *
 * This is used to create a token after a user logs in or signs up,
 * which can then be stored in a cookie to maintain user sessions.
 *
 * @param payload - The data to encode in the token (e.g. userId)
 * @returns A signed JWT string valid for 7 days
 */
export function encodeToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verifies and decodes a JWT token using the secret key.
 *
 * This is used to check if the token is valid and extract the data inside,
 * such as the user ID, during authenticated requests like `/api/auth/me`.
 *
 * @param token - The JWT string to verify
 * @returns The decoded payload if valid, or throws an error if invalid/expired
 */
export function decodeToken(token: string): any {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}

/**
 * Validates whether a string is a well-formed email.
 * @param email - The email string to validate
 * @returns True if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}

/**
 * Validates a password for basic security standards:
 * - Minimum 8 characters
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one digit
 * - At least one special character (!@#$%^&* etc.)
 * - No spaces allowed
 *
 * @param password - The password string to validate
 * @returns True if the password is valid, false otherwise
 */
export function validatePassword(password: string): boolean {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNoSpaces = !/\s/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar &&
    hasNoSpaces
  );
}

/**
 * Sanitizes and normalizes an email string.
 * @param email - The raw email input
 * @returns A normalized and trimmed email, or null if invalid
 */
export function sanitizeEmail(email: string): string | null {
  const normalized = validator.normalizeEmail(email.trim());
  return normalized || null;
}

/**
 * Sanitizes a password input by trimming and escaping special characters.
 * @param password - The raw password input
 * @returns A sanitized password string
 */
export function sanitizePassword(password: string): string {
  return validator.escape(password.trim());
}

/**
 * Validates password strength using basic security rules:
 * - Minimum 8 characters
 * - At least 1 lowercase, 1 uppercase, 1 number, and 1 symbol
 * @param password - The password string to check
 * @returns True if password meets strength requirements
 */
export function isStrongPassword(password: string): boolean {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
}
