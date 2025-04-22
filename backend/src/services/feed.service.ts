// src/services/feed.service.ts

import databaseClient from "../db-client";
import { Prisma, Profile, Interest } from "@prisma/client";

/**
 * Fetches user profiles for the public feed, with optional configuration.
 *
 * By default, returns all profiles. You can:
 * - Exclude a user (e.g. the current user) by passing their `userId`
 * - Include related data (like interests) via the options parameter
 *
 * This creates a reusable and scalable service for both feed views
 * and admin utilities, with support for pagination or filtering later.
 *
 * @param options - Optional settings for filtering and relation inclusion
 * @returns An array of profile objects
 */
export const getProfileService = async (options?: {
  excludeUserId?: string;
  includeInterests?: boolean;
}): Promise<Profile[]> => {
  const { excludeUserId, includeInterests } = options || {};

  return databaseClient.profile.findMany({
    where: excludeUserId ? { userId: { not: excludeUserId } } : undefined,
    include: includeInterests ? { interests: true } : undefined,
  });
};
