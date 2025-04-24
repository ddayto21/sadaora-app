import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { encodeToken, decodeToken, isValidEmail } from "./auth";
import type { AuthTokenPayload } from "../interfaces/auth";

describe.skip("Auth-related utility functions", () => {
  it("should encode user data into a JWT", () => {
    const payload: AuthTokenPayload = {
      userId: "1",
      email: "email@gmail.com",
      role: "user",
    };

    const token = encodeToken(payload);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = decodeToken(token);

    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
    expect(decoded.exp).toBeGreaterThan(decoded.iat); // check that token has a valid lifespan
  });
});

/**
 * @testSuite Email Validation Utility
 *
 * This test suite ensures that the `isValidEmail` utility correctly
 * validates email strings using a regular expression.
 *
 * - Validates common and RFC-compliant email formats.
 * - Rejects malformed or incomplete addresses.
 * - Helps prevent invalid input from being accepted during signup/login flows.
 */
describe("isValidEmail", () => {
  it("should return true for valid email addresses", () => {
    const validEmails = [
      "user@example.com",
      "user.name+tag@example.co.uk",
      "user_name@example.io",
      "user-name@sub.domain.org",
      "u@x.io",
    ];

    validEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  it("should return false for invalid email addresses", () => {
    const invalidEmails = [
      "plainaddress",
      "@missingusername.com",
      "username@.com",
      "username@domain..com",
      "username@domain.c",
      "username@domain.c@om",
      "username@domain.c@om.",
      "user@",
      "user@com",
      "user@.com.com",
    ];

    invalidEmails.forEach((email) => {
      // Log the email being tested
      const isValid = isValidEmail(email);

      expect(isValidEmail(email)).toBe(false);
    });
  });
});
