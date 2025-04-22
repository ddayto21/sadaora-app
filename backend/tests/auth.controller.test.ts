import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../src/index";
import databaseClient from "../src/db-client";

let testEmail: string;
let testPassword: string;

/**
 * Runs once before all tests in this file.
 *
 * - Connects to the PostgreSQL database using Prisma
 * - Generates a unique test email and password
 */
beforeAll(async () => {
  await databaseClient.$connect();
  const timestamp = Date.now();
  testEmail = `test-${timestamp}@example.com`;
  testPassword = "plaintext123";
});

/**
 * Runs once after all tests have completed.
 *
 * - Deletes test users and disconnects the Prisma client
 */
afterAll(async () => {
  await databaseClient.user.deleteMany({
    where: { email: { contains: "test-" } },
  });
  await databaseClient.$disconnect();
});

/**
 * Integration test for the `/api/auth/signup` route.
 *
 * This test sends a real HTTP POST request to create a user and expects a 201 response.
 * It verifies the returned user data and ensures password hashing is in place.
 */
describe("POST /api/auth/signup", () => {
  it("should create a new user and return 201", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ email: testEmail, password: testPassword });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(testEmail);
    expect(response.body.password).not.toBe(testPassword); // should be hashed
  });
});

/**
 * Integration tests for the `/api/auth/login` route.
 *
 * These tests validate correct login behavior, error handling,
 * and cookie-based JWT token support using real requests.
 */
describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    // Ensure the user exists before testing login
    await request(app)
      .post("/api/auth/signup")
      .send({ email: testEmail, password: testPassword });
  });

  it("should return 200 and user object if valid credentials provided", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: testPassword });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(testEmail);
    expect(response.headers["set-cookie"]).toBeDefined(); // verify cookie is set
  });

  it("should return 401 if password is invalid", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: "wrong-password" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid email or password");
  });

  it("should return 401 if email is not found", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "nonexistent@example.com", password: testPassword });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid email or password");
  });
});
