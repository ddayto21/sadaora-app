import request from "supertest";
import app from "../index";
import e from "express";

const testEmail = "test@gmail.com";
const testPassword = "password123";


describe.skip("POST /api/auth/login", () => {
  it.skip("should login an existing user", async () => {
    const response = await request(app).post("/api/auth/login").send();

    expect(response.status);
    console.log(`response.body: ${JSON.stringify(response.body, null, 2)}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
    expect(response.body).not.toHaveProperty("password");
  });

  it.skip("should fail to login a non-existen user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: `nonexistent-user@gmail.com`,
      password: "password123",
    });

    expect(response.status);
    console.log(`response.body: ${JSON.stringify(response.body, null, 2)}`);

    expect(response.body).not.toHaveProperty("id");
    expect(response.body).not.toHaveProperty("email");
    expect(response.body).not.toHaveProperty("password");

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Invalid email or password");
  });
});

describe("POST /api/auth/delete", () => {
  it.skip("should delete an existing user", async () => {
    const response = await request(app).post("/api/auth/delete").send({
      email: `a@gmail.com`,
      password: "password123",
    });

    expect(response.status);
    console.log(`response.body: ${JSON.stringify(response.body, null, 2)}`);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("User deleted successfully");
    expect(response.body).not.toHaveProperty("id");
    expect(response.body).not.toHaveProperty("email");
    expect(response.body).not.toHaveProperty("password");
    expect(response.body).not.toHaveProperty("error");
  });

  it.skip("should fail to delete a user without valid credentials user", async () => {
    const response = await request(app).post("/api/auth/delete").send({
      email: `a@gmail.com`,
      password: "wrongpassword",
    });

    expect(response.status);
    console.log(`response.body: ${JSON.stringify(response.body, null, 2)}`);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("User deleted successfully");
    expect(response.body).not.toHaveProperty("id");
    expect(response.body).not.toHaveProperty("email");
    expect(response.body).not.toHaveProperty("password");
    expect(response.body).not.toHaveProperty("error");
  });
});
