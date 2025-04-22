// src/services/profile.service.ts
import databaseClient from "../db-client";
import { Prisma, Profile, Interest } from "@prisma/client";

type CreateProfileInput = Prisma.ProfileCreateInput;
type UpdateProfileInput = Prisma.ProfileUpdateInput;

/**
 * Creates a new profile for the given user.
 *
 * - Accepts profile details and a list of interest tags
 * - Links the profile to the user via `userId`
 * - Creates related `Interest` records
 *
 * @param userId - ID of the authenticated user
 * @param data - Profile fields and list of interest labels
 * @returns The newly created profile with interests
 */
export const createProfile = async (
  userId: string,
  data: Omit<Prisma.ProfileCreateInput, "user" | "interests"> & {
    interests: string[];
  }
) => {
  const { interests, ...profileData } = data;

  return databaseClient.profile.create({
    data: {
      ...profileData,
      userId,
      interests: {
        create: interests.map((label: string) => ({ label })),
      },
    },
    include: { interests: true },
  });
};

/**
 * Retrieves the profile for a given user ID.
 *
 * @param userId - The ID of the user whose profile is being fetched
 * @returns The profile and its associated interests, or null if not found
 */
export const getProfile = async (
  userId: string
): Promise<(Profile & { interests: Interest[] }) | null> => {
  return databaseClient.profile.findUnique({
    where: { userId },
    include: { interests: true },
  });
};

/**
 * Updates the profile for a given user ID.
 *
 * - Deletes all existing interests
 * - Replaces them with a new set of interest labels
 * - Updates other profile fields
 *
 * @param userId - The ID of the user whose profile is being updated
 * @param data - New profile fields and interest labels
 * @returns The updated profile with interests
 */
export const updateProfile = async (
  userId: string,
  data: Omit<Prisma.ProfileUpdateInput, "interests"> & { interests: string[] }
) => {
  const { interests, ...profileData } = data;

  // delete and recreate interests for simplicity
  await databaseClient.interest.deleteMany({ where: { profile: { userId } } });

  return databaseClient.profile.update({
    where: { userId },
    data: {
      ...profileData,
      interests: {
        create: interests.map((label: string) => ({ label })),
      },
    },
    include: { interests: true },
  });
};

/**
 * Deletes the profile and its associated interests for a given user ID.
 *
 * @param userId - The ID of the user whose profile should be deleted
 * @returns The deleted profile record
 */
export const deleteProfile = async (userId: string) => {
  // First delete related interests to avoid foreign key constraint error
  await databaseClient.interest.deleteMany({
    where: { profile: { userId } },
  });

  return databaseClient.profile.delete({
    where: { userId },
  });
};
