import { deleteUser, createUser } from "../services/auth.service";

/**
 * Creates a clean test user in the database by deleting any existing entry
 * and inserting a fresh user with a known email and password.
 *
 * Use this function in test setup (`beforeEach`, `beforeAll`, or inside specific test cases)
 * to ensure a consistent user state for authentication or database-related tests.
 *
 * @param email - The email address of the test user (must be unique)
 * @param password - The plaintext password of the test user
 * @returns The newly created user object
 *
 * @example
 * const testUser = await setupTestUser("test@example.com", "Plaintext123!");
 * expect(testUser).toHaveProperty("id");
 */
export async function setupTestUser(email: string, password: string) {
  await deleteUser(email);
  return createUser(email, password);
}
