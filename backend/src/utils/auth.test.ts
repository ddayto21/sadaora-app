// src/utils/auth.test.ts
// src/utils/auth.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  encodeToken,
  decodeToken,
  isValidEmail,
  validatePassword,
} from "./auth";
import type { AuthTokenPayload } from "../interfaces/auth";
import { setupTestUser } from "./setup-test-user";

/**
 * @testSuite JWT Token Utilities
 *
 * Verifies correct encoding and decoding of user payloads using JSON Web Tokens.
 */
describe("JWT utility functions", () => {
  const testUser: AuthTokenPayload = {
    userId: "1",
    email: "email@gmail.com",
    role: "user",
  };

  let token: string;

  beforeEach(() => {
    token = encodeToken(testUser);
  });

  it("should encode user payload into a valid token", () => {
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  it("should decode a valid token into the correct payload", () => {
    const decoded = decodeToken(token);

    expect(decoded.userId).toBe(testUser.userId);
    expect(decoded.email).toBe(testUser.email);
    expect(decoded.role).toBe(testUser.role);
    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });
});

/**
 * @testSuite Email Validation
 *
 * Tests the isValidEmail utility for accepting well-formed emails and rejecting malformed inputs.
 */
describe("Email validation", () => {
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
      expect(isValidEmail(email)).toBe(false);
    });
  });
});

/**
 * @testSuite Password Validation
 *
 * Ensures password strength validation follows secure formatting rules.
 */
describe("Password validation", () => {
  it("should accept strong valid passwords", () => {
    const validPasswords = [
      "StrongPass1!",
      "Valid$123",
      "My@Secure9",
      "Test!Pass8",
    ];

    validPasswords.forEach((password) => {
      expect(validatePassword(password)).toBe(true);
    });
  });

  it("should reject weak or malformed passwords", () => {
    const invalidPasswords = [
      "A1!a", // too short
      "weakpass1!", // no uppercase
      "WEAKPASS1!", // no lowercase
      "Weakpass!", // no number
      "Weakpass1", // no symbol
      "Weak pass1!", // contains space
    ];

    invalidPasswords.forEach((password) => {
      expect(validatePassword(password)).toBe(false);
    });
  });
});
