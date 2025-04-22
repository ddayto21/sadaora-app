// frontend/src/api/profile.ts
import { Profile } from "../types/profile";

/**
 *
 * - Use /api/profile/:id for clicking a user in the feed (pass userId from feed).
 * - Use /api/profile for accessing the logged-in user’s own profile (via token).
 */

/**
 * Fetches the current logged-in user's profile using a secure token.
 *
 * This is used when rendering `/profile` route.
 * Makes a GET request to `/api/profile` (not `/api/auth/me`) to access profile info.
 *
 * @returns Promise resolving to the current user's Profile
 */
export const fetchMyProfile = async (): Promise<Profile> => {
  const res = await fetch("http://localhost:3001/api/profile", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch your profile");
  }

  return res.json();
};

/**
 * Fetches another user's public profile by their user ID.
 *
 * This is used when a user clicks a card in the feed to view another user's profile.
 *
 * @param userId - The target user's ID
 * @returns Promise resolving to the target Profile
 */
export const fetchProfileById = async (userId: string): Promise<Profile> => {
  const res = await fetch(`http://localhost:3001/api/profile/${userId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch profile with ID: ${userId}`);
  }

  return res.json();
};
