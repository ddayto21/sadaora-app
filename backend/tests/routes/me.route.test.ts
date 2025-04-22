import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../../src/index";
import databaseClient from "../../src/db-client";

/**
 * Integration test for the `/api/auth/me` route.
 *
 * This test simulates a full flow:
 * 1. A user signs up via `/api/auth/signup`
 * 2. The JWT token is returned in a secure cookie
 * 3. The cookie is sent with a GET request to `/api/auth/me`
 * 4. The server verifies the token and returns the current user
 *
 * Purpose: To ensure authenticated users can fetch their current session info.
 */

const testEmail = `test-me-${Date.now()}@example.com`;
const testPassword = "plaintext123";

let authCookie: string[]; // holds the JWT cookie for session continuity

beforeAll(async () => {
  await databaseClient.$connect();

  // Sign up a new user and store the auth cookie
  const response = await request(app)
    .post("/api/auth/signup")
    .send({ email: testEmail, password: testPassword });

  authCookie = response.headers["set-cookie"];
});

afterAll(async () => {
  await databaseClient.user.deleteMany({
    where: { email: { contains: "test-me-" } },
  });
  await databaseClient.$disconnect();
});

describe("GET /api/auth/me", () => {
  it("should return 200 and the current user if token is valid", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", authCookie); // send token from signup

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(testEmail);
  });

  it("should return 401 if token is missing", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Not authenticated");
  });

  it("should return 401 if token is invalid", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", "token=invalid.token.string");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid or expired token");
  });
});