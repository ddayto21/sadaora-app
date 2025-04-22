import jwt from "jsonwebtoken";

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
export function encodeToken(payload: object): string {
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
  return jwt.verify(token, JWT_SECRET);
}
