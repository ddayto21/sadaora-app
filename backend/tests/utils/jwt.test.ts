import { describe, it, expect } from "vitest";
import { encodeToken, decodeToken } from "../../src/utils/jwt";

/**
 * Unit tests for the JWT utility functions.
 *
 * These tests ensure that:
 * - A token is successfully generated from a given payload
 * - A generated token can be verified and decoded correctly
 * - Invalid or tampered tokens are not accepted
 */

describe("JWT Utilities", () => {
  const payload = { userId: "user-123" };

  it("should generate a valid JWT token", () => {
    const token = encodeToken(payload);

    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3); // JWT format: header.payload.signature
  });

  it("should verify and decode a valid token correctly", () => {
    const token = encodeToken(payload);
    const decoded = decodeToken(token);

    expect(decoded).toHaveProperty("userId", payload.userId);
    expect(decoded).toHaveProperty("iat"); // issued at
    expect(decoded).toHaveProperty("exp"); // expiration
  });

  it("should throw an error for an invalid token", () => {
    const fakeToken = "invalid.token.string";

    expect(() => decodeToken(fakeToken)).toThrow();
  });
});
