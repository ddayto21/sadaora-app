import { describe, it, expect } from "vitest";
import databaseClient from "../src/db-client";

/**
 * Tests that the database client:
 * - Is properly instantiated with expected methods and models.
 * - Can successfully connect to and disconnect from the database without error.
 */

describe("Prisma database client", () => {
  it("should be an instance of PrismaClient", () => {
    expect(databaseClient).toHaveProperty("user");
    expect(databaseClient).toHaveProperty("$connect");
    expect(databaseClient).toHaveProperty("$disconnect");
  });

  it("should connect to the database without throwing an error", async () => {
    await expect(databaseClient.$connect()).resolves.not.toThrow();
    await databaseClient.$disconnect();
  });
});

// async function createUser() {
//   try {
//     // Create a test user
//     const user = await prisma.user.create({
//       data: {
//         email: "test@example.com",
//         password: "secure",
//       },
//     });
//     console.log("User created:", user);
//   } catch (error) {
//     console.error("Error creating user:", error);
//   }
// }

// createUser();
