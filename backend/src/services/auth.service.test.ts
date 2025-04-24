// src/services/auth.service.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  createUser,
  loginUser,
  verifyAuthToken,
  getAllUsers,
  findUserByEmail,
  deleteUser,
} from "./auth.service";

import { encodeToken } from "../utils/auth";
import type { AuthTokenPayload } from "../interfaces/auth";

/**
 * Integration tests for authentication services.
 *
 * These tests verify:
 * - A new user is created and saved with a hashed password
 * - A valid user can be authenticated using correct credentials
 * - Invalid email or password returns null (authentication fails)
 */

describe("Authentication Service - CRUD Operations", () => {
  const email = "test@example.com";
  const password = "plaintext123";

  describe("User Creation", () => {
    it.skip("createUser - should create and write user to the database", async () => {
      const user = await createUser(email, password);

      expect(user).toHaveProperty("id");
      expect(user).not.toBeNull();
      expect(user).not.toBeUndefined();
      expect(user!.email).toBe(email);
      // Verify the password is hashed, rather than stored in plaintext
      expect(user.password).not.toBe(password);
    });
  });
  describe("Login Flow", () => {
    it.skip("loginUser - should return the user if credentials are valid", async () => {
      const user = await loginUser(email, password);
      console.log(`User: ${JSON.stringify(user, null, 2)}`);
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email");

      expect(user).not.toBeNull();
      expect(user!.email).toBe(email);
    });

    it.skip("loginUser - should return null if password is invalid", async () => {
      const user = await loginUser(email, "password");
      expect(user).toBeNull();
    });

    it.skip("loginUser - should return null if email is invalid", async () => {
      const user = await loginUser("notfound@example.com", password);
      expect(user).toBeNull();
    });

    it.skip("loginUser - valid credentials should return user data", async () => {
      const user = await loginUser(email, password);
      console.log(`User: ${JSON.stringify(user, null, 2)}`);

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("password");
      expect(user).not.toBeNull();
      expect(user).not.toBeUndefined();

      expect(user!.email).toBe(email);
      // Ensure the password is hashed
    });
  });

  describe("User Deletion", () => {
    it.skip("deleteUser() - should remove user from the database table via email", async () => {
      const response = await deleteUser("a@gmail.com");
      console.log(`Deleted user: ${JSON.stringify(response, null, 2)}`);
      expect(response).toBeDefined();
      expect(response).toBeNull();
      console.log(`JSON response: ${JSON.stringify(response, null, 2)}`);
    });
  });
  describe("Token Verification", () => {
    it.skip("verifyAuthToken() - should return null for invalid token", async () => {
      const response = await verifyAuthToken("invalid-token");
      expect(response).toBeDefined();
      expect(response).toBeNull();
    });

    it.skip("should return user payload for valid token", async () => {
      const payload: AuthTokenPayload = {
        userId: "12345",
        email: "test@example.com",
        role: "user",
      };
      // console.log(
      //   `Encoding token with payload: ${JSON.stringify(payload, null, 2)}`
      // );

      const token = encodeToken(payload);
      // console.log(`Generated token: ${token}`);

      const result = await verifyAuthToken(token);
      // console.log(`Decoded token: ${JSON.stringify(result, null, 2)}`);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("email");
      expect(result).not.toHaveProperty("password");
      expect(result).toHaveProperty("role");
    });
  });
});
