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
const testPassword = "plainTextPassword12#";

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
  it.skip("should create a new user and return 201", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ email: testEmail, password: testPassword });

    console.log(`response.body: ${JSON.stringify(response.body, null, 2)}`);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(testEmail);
    expect(response.body.password).not.toBe(testPassword);
  });

  it.skip("valid credentials should create user in database table", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: testEmail,
      password: testPassword,
    });

    expect(response.status);

    expect(response.body).not.toHaveProperty("password");
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
  });

  it.skip("should fail to create a user with an existing email", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: testEmail,
      password: testPassword,
    });
    expect(response.body.error).toBe("Email already registered");
    expect(response.body).toHaveProperty("error");
  });

  it("should fail to create a user with invalid email", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: "invalid-email-format",
      password: testPassword,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Invalid email format");
  });

  it("should fail to create a user with invalid password", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: "user@gmail.com",
      password: "short",
    });

    console.log(`response.body: ${JSON.stringify(response.body, null, 2)}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe(
      "Password must be at least 8 characters long, contain uppercase and lowercase letters, numbers, and special characters"
    );
  });
});
