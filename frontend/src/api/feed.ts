// frontend/src/api/feed.ts
import { Profile } from "../types/profile";

/**
 * Fetches the list of public profiles from the backend API.
 * This is used to populate the public feed (excluding current user).
 *
 * @returns A Promise resolving to an array of Profile objects.
 */
export const fetchPublicFeed = async (): Promise<Profile[]> => {
  const response = await fetch("http://localhost:3001/api/feed", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load public feed");
  }

  return await response.json();
};