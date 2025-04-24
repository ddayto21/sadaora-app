import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getProfileService } from "../../src/services/feed.service";

import databaseClient from "../../src/db-client";

beforeAll(async () => {
  await databaseClient.$connect();
});

afterAll(async () => {
  await databaseClient.user.deleteMany({
    where: { email: "test@example.com" },
  });
  await databaseClient.$disconnect();
});

it("should display all existing users in database table", async () => {
  const profiles = await getProfileService();
  expect(profiles.length).toBeGreaterThan(0);
  expect(profiles[0]).toHaveProperty("id");
  // console.log(`[*] Profiles: ${JSON.stringify(profiles, null, 2)}`);
  expect(profiles[0].name).toBeDefined();
  expect(profiles[0].bio).toBeDefined();
  expect(profiles[0].headline).toBeDefined();
  expect(profiles[0].photoUrl).toBeDefined();
});
