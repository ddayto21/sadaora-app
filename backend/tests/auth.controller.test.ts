// tests/auth.controller.test.ts
import { signup, login } from "../src/controllers/auth.controller";
import { createUser } from "../src/services/auth.services";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Request, Response } from "express";
import databaseClient from "../src/db-client";

let testEmail: string;
let testPassword: string;

/**
 * Runs once before all tests in this file.
 *
 * - Connects to the PostgreSQL database using Prisma
 * - Generates a unique test email and password for consistent test usage
 * - Ensures shared setup logic is handled before any test executes
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
 * - Deletes all users created during tests to keep the database clean
 * - Disconnects from the Prisma database client
 * - Prevents leftover test data or open DB connections from affecting future tests
 */
afterAll(async () => {
  await databaseClient.user.deleteMany({
    where: {
      email: { contains: "test-" },
    },
  });
  await databaseClient.$disconnect();
});

/**
 * Utility to generate mock Express request and response objects.
 * Captures status codes and JSON responses for assertions.
 */
function createMockRequestResponse(body: Record<string, any>): {
  request: Request;
  response: Response;
  capture: { statusCode: number; body: any };
} {
  const request = { body } as Request;
  const capture = { statusCode: 0, body: null };

  const response = {
    status(code: number) {
      capture.statusCode = code;
      return this;
    },
    json(data: any) {
      capture.body = data;
      return this;
    },
  } as unknown as Response;

  return { request, response, capture };
}

/**
 * Integration test for the `signup` controller.
 * - Uses real Prisma client and service
 * - Ensures response contains new user object and hashed password
 */

describe("signup (controller)", () => {
  it("should create a user and return a 201 response", async () => {
    const { request, response, capture } = createMockRequestResponse({
      email: testEmail,
      password: testPassword,
    });
    // Create response object with tracking behavior

    let statusCode = 0;
    let responseBody: any = null;

    await signup(request, response);

    expect(capture.statusCode).toBe(201);
    expect(capture.body).toHaveProperty("id");
    expect(capture.body.email).toBe(testEmail);
    expect(capture.body.password).not.toBe(testPassword); // password should be hashed
  });
});

/**
 * Integration tests for the `login` controller.
 * Verifies successful and failed login attempts with valid and invalid credentials.
 */

describe("login (controller)", () => {
  it("should return 200 and user object if valid credentials provided", async () => {
    const { request, response, capture } = createMockRequestResponse({
      email: testEmail,
      password: testPassword,
    });

    await login(request, response);

    expect(capture.statusCode).toBe(200);
    expect(capture.body).toHaveProperty("id");
    expect(capture.body.email).toBe(testEmail);
  });

  it("should return 401 if password is invalid", async () => {
    const { request, response, capture } = createMockRequestResponse({
      email: testEmail,
      password: "wrong-password",
    });
    await login(request, response);
    expect(capture.statusCode).toBe(401);
    expect(capture.body).toHaveProperty("error", "Invalid email or password");
  });

  it("should return 401 if email not found", async () => {
    const { request, response, capture } = createMockRequestResponse({
      email: "not-found@example.com",
      password: testPassword,
    });

    await login(request, response);

    expect(capture.statusCode).toBe(401);
    expect(capture.body).toHaveProperty("error", "Invalid email or password");
  });
});
