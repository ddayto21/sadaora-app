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


