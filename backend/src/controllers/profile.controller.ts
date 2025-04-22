// src/controllers/profile.controller.ts

import { Request, Response, RequestHandler } from "express";
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../services/profile.service";

/**
 * Creates a new profile for the logged-in user.
 *
 * Extracts profile details (name, bio, headline, photoUrl, interests)
 * from the request body and passes them to the profile creation service.
 * Associates the profile with the authenticated user's ID.
 * Responds with the newly created profile and a 201 status code.
 */
export const createHandler: RequestHandler = async (req, res) => {
  const { name, bio, headline, photoUrl, interests } = req.body;

  const userId = req.user?.userId;
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
 * Retrieves the current user's profile.
 *
 * Uses the authenticated user's ID (from req.user) to fetch their profile.
 * Responds with the profile data and a 200 status code.
 */
export const readHandler: RequestHandler = async (req, res) => {
  const userId = req.user.userId;
  const profile = await getProfile(userId);
  res.status(200).json(profile);
};

/**
 * Updates the current user's profile.
 *
 * Accepts updated profile data from the request body and applies it to
 * the existing profile associated with the user's ID.
 * Responds with the updated profile and a 200 status code.
 */
export const updateHandler: RequestHandler = async (req, res) => {
  const userId = req.user.userId;
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
  const userId = req.user.userId;
  await deleteProfile(userId);
  res.status(204).send();
};
