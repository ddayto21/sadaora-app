// src/controllers/profile.controller.ts

import { Request, Response, RequestHandler } from "express";

// Extend the Request interface to include the 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        // Add other properties if needed
      };
    }
  }
}
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../services/profile.service";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    // Add other properties if needed
  };
}

/**
 * Creates a new profile for the logged-in user.
 *
 * Extracts profile details (name, bio, headline, photoUrl, interests)
 * from the request body and passes them to the profile creation service.
 * Associates the profile with the authenticated user's ID.
 * Responds with the newly created profile and a 201 status code.
 */
export const createHandler: RequestHandler = async (
  req: AuthenticatedRequest,
  res
) => {
  const { name, bio, headline, photoUrl, interests } = req.body;

  const userId = req.user?.userId; // Ensure req.user is properly typed
  if (!userId) {
    res.status(401).json({ error: "User ID missing" });
    return;
  }

  const profile = await createProfile(userId, {
    name,
    bio,
    headline,
    photoUrl,
    interests,
  });
  res.status(201).json(profile);
};

/**
 * Controller for GET /api/profile
 *
 * Retrieves the profile for the currently authenticated user.
 * The user ID is extracted from the decoded JWT in `req.user.userId`.
 *
 * Responds with:
 * - 200 and profile data if successful
 * - 401 if the user is not authenticated
 * - 404 if no profile exists for the user
 */
export const getProfileHandler: RequestHandler = async (req, res) => {
  console.log(`[getProfileHandler] controller function running`);

  // Extract the userId from the request body
  const userId = req.body?.userId;
  console.log(`[*] Fetching profile for userId: ${userId}`);

  if (!userId) {
    res.status(401).json({ error: "Missing userId" });
    return;
  }

  try {
    const profile = await getProfile(userId, { includeUser: true });
    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    console.log(`[*] Profile retrieved:`, JSON.stringify(profile, null, 2));

    res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching current user profile:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
/**
 * Controller to handle GET /api/profile/:id
 *
 * Retrieves a public user profile based on the given `userId` in the route param.
 * Uses the `getUserProfile` service with no sensitive user details included.
 *
 * Responds with:
 * - 200 and the profile data if found
 * - 404 if no profile matches the provided ID
 */
export const getProfileByIdHandler: RequestHandler = async (req, res) => {
  console.log(`/api/profile/:id`);
  console.log(`[getProfileByIdHandler]`);

  // Extract the userId from the request parameters
  const userId = req.params.id;
  console.log(`[*] Fetching profile for userId: ${userId}`);

  // Check if the userId is valid
  if (!userId || userId.length !== 24) {
    res.status(400).json({ error: "Invalid userId" });
    return;
  }

  try {
    const profile = await getProfile(userId);

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Updates the current user's profile.
 *
 * Accepts updated profile data from the request body and applies it to
 * the existing profile associated with the user's ID.
 * Responds with the updated profile and a 200 status code.
 */
export const updateHandler: RequestHandler = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: "User ID missing" });
    return;
  }
  const updated = await updateProfile(userId, req.body);
  res.status(200).json(updated);
};

/**
 * Deletes the current user's profile.
 *
 * Removes the profile associated with the authenticated user's ID.
 * Responds with a 204 No Content status code on success.
 */
export const deleteHandler: RequestHandler = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: "User ID missing" });
    return;
  }
  await deleteProfile(userId);
  res.status(204).send();
};
