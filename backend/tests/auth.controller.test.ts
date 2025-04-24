// tests/auth.controller.test.ts
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../src/index";
import databaseClient from "../src/db-client";

let testEmail: string;
let testPassword: string;

beforeAll(async () => {
  await databaseClient.$connect();
  const timestamp = Date.now();
  testEmail = `test-${timestamp}@example.com`;
  testPassword = "plaintext123";
});

afterAll(async () => {
  await databaseClient.user.deleteMany({
    where: { email: { contains: "test-" } },
  });
  await databaseClient.$disconnect();
});

describe.skip("POST /api/auth/signup", () => {
  it("should create a new user and return 201", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ email: testEmail, password: testPassword });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(testEmail);
    expect(response.body.password).not.toBe(testPassword);
  });
});

describe.skip("POST /api/auth/login", () => {
  it("should return 200 and user object if valid credentials provided", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: testPassword });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(testEmail);
    expect(response.headers["set-cookie"]).toBeDefined();
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
