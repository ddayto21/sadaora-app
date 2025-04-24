import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import databaseClient from "../../src/db-client";
import { sign } from "crypto";

/**
 * Integration test for the `/api/auth/login` route.
 *
 * This test ensures that a user can log in with valid credentials.
 * It goes through the full backend flow — sending a real HTTP POST request,
 * verifying against the actual database (no mocks).
 */

const testEmail = `test-login-${Date.now()}@example.com`;
const testPassword = "plaintext1234";

/**
 * Create a user in the database before running the tests.
 * This is necessary because the login route checks for existing users.
 */
beforeAll(async () => {
  await databaseClient.$connect();

  // Make sure user exists
  const signup = await request(app)
    .post("/api/auth/signup")
    .send({ email: testEmail, password: testPassword });

  expect(signup.status).toBe(201);
  
});

afterAll(async () => {
  await databaseClient.user.deleteMany({
    where: { email: { contains: "test-login-" } },
  });
  await databaseClient.$disconnect();
});

describe.skip("POST /api/auth/login", () => {
  it("should return 200 and user if credentials are valid", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: testPassword });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(testEmail);
  });

  it("should return 401 if password is incorrect", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: "wront-password" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid email or password");
  });

  it("should return 401 if email not found", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "non-existent@example.com", password: testPassword });

    expect(response.status).toBe(401);

    expect(response.body).toHaveProperty("error", "Invalid email or password");
  });
});
