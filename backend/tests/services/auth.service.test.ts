import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createUser, loginUser } from "../../src/services/auth.service";
import databaseClient from "../../src/db-client";

beforeAll(async () => {
  await databaseClient.$connect();
});

afterAll(async () => {
  await databaseClient.user.deleteMany({
    where: { email: "test@example.com" },
  });
  await databaseClient.$disconnect();
});

/**
 * Integration tests for authentication services.
 *
 * These tests verify:
 * - A new user is created and saved with a hashed password
 * - A valid user can be authenticated using correct credentials
 * - Invalid email or password returns null (authentication fails)
 */
describe("Authentication service integration tests", () => {
  const email = "test@example.com";
  const password = "plaintext123";

  const invalidPassword = "wrongpassword";
  const invalidEmail = "invalid@email.com";

  it("createUser - should has the password and save a user to the database", async () => {
    const user = await createUser(email, password);

    expect(user).toHaveProperty("id");
    expect(user).not.toBeNull();
    expect(user).not.toBeUndefined();
    expect(user!.email).toBe(email);
    // Verify the password is hashed, rather than stored in plaintext
    expect(user.password).not.toBe(password);
  });

  it("loginUser - should return the user if credentials are valid", async () => {
    const user = await loginUser(email, password);

    expect(user).not.toBeNull();
    expect(user!.email).toBe(email);
  });

  it("loginUser - should return null if password is invalid", async () => {
    const user = await loginUser(email, "password");
    expect(user).toBeNull();
  });

  it('loginUser - should return null if email is invalid', async () => {
    const user = await loginUser('notfound@example.com', password);
    expect(user).toBeNull();
  })
});
