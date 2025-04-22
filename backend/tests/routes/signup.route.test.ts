import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../../src/index";
import databaseClient from "../../src/db-client";

/**
 * Integration test for the `/api/auth/signup` route.
 *
 * This test simulates a real user signing up by sending an HTTP POST request to the backend.
 * It verifies that the entire system works together — from the API route, through the controller and service layers,
 * all the way to writing a new user record in the actual database.
 *
 * Purpose: To ensure the signup feature reliably creates a user with a hashed password and stores it securely.
 */

const testEmail = `test-${Date.now()}@example.com`;
const testPassword = "plaintext1234";

beforeAll(async () => {
  await databaseClient.$connect();
});

afterAll(async () => {
  await databaseClient.user.deleteMany({
    where: {
      email: { contains: "test-" },
    },
  });
  await databaseClient.$disconnect();
});

describe("POST /api/auth/signup", () => {
  it("should create a new user and return 201", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ email: testEmail, password: testPassword });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(testEmail);
    // Ensure the password is hashed
    expect(response.body.password).not.toBe(testPassword);
  });
});
