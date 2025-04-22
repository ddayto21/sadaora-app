import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createProfile, getProfile, updateProfile, deleteProfile } from "../../src/services/profile.service";

import databaseClient from "../../src/db-client";
import { createUser } from "../../src/services/auth.service";

const testEmail = `profile-${Date.now()}@example.com`;
const testPassword = "securepass123";
let userId: string;

beforeAll(async () => {
  await databaseClient.$connect();

  // Create a user to link the profile
  const user = await createUser(testEmail, testPassword);
  userId = user.id;
});

afterAll(async () => {
  await databaseClient.interest.deleteMany({ where: { profile: { userId } } });
  await databaseClient.profile.deleteMany({ where: { userId } });
  await databaseClient.user.deleteMany({ where: { id: userId } });

  await databaseClient.$disconnect();
});

/**
 * Tests the createProfile service.
 *
 * Expected behavior:
 * - Should successfully create a profile linked to the user
 * - Should include a list of interest tags
 */
it("should create a profile with interests", async () => {
  const profile = await createProfile(userId, {
    name: "Test User",
    bio: "Just a test user.",
    headline: "Testing things",
    photoUrl: null,
    interests: ["Coding", "Reading"],
  });

  expect(profile).toBeDefined();
  expect(profile.name).toBe("Test User");
  expect(profile.interests.length).toBe(2);
});

/**
 * Tests the getProfile service.
 *
 * Expected behavior:
 * - Should retrieve the profile associated with the user
 * - Should return full profile data including interests
 */
it("should retrieve the user’s profile", async () => {
  const profile = await getProfile(userId);

  expect(profile).not.toBeNull();
  expect(profile?.userId).toBe(userId);
  expect(profile?.interests.length).toBeGreaterThan(0);
});

/**
 * Tests the updateProfile service.
 *
 * Expected behavior:
 * - Should update profile fields (e.g., name, bio)
 * - Should replace all previous interests with new ones
 */
it("should update profile details and interests", async () => {
  const updated = await updateProfile(userId, {
    name: "Updated Name",
    bio: "Updated bio.",
    headline: "Updated headline",
    photoUrl: "http://example.com/photo.jpg",
    interests: ["Traveling", "Cooking"],
  });

  expect(updated.name).toBe("Updated Name");
  expect(updated.bio).toBe("Updated bio.");
  expect(updated.interests.length).toBe(2);
  expect(updated.interests.map((i) => i.label)).toContain("Cooking");
});

/**
 * Tests the deleteProfile service.
 *
 * Expected behavior:
 * - Should delete the profile associated with the user
 * - Further calls to getProfile should return null
 */
it("should delete the profile", async () => {
  const deleted = await deleteProfile(userId);
  expect(deleted.userId).toBe(userId);

  const check = await getProfile(userId);
  expect(check).toBeNull();
});
