import { Request, Response, RequestHandler } from "express";
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../services/profile.service";

export const createHandler: RequestHandler = async (req, res) => {
  const { name, bio, headline, photoUrl, interests } = req.body;
  const userId = req.user?.userId;

  const profile = await createProfile(userId, {
    name,
    bio,
    headline,
    photoUrl,
    interests,
  });
  res.status(201).json(profile);
};

export const readHandler: RequestHandler = async (req, res) => {
  const userId = req.user.userId;
  const profile = await getProfile(userId);
  res.status(200).json(profile);
};

export const updateHandler: RequestHandler = async (req, res) => {
  const userId = req.user.userId;
  const updated = await updateProfile(userId, req.body);
  res.status(200).json(updated);
};

export const deleteHandler: RequestHandler = async (req, res) => {
  const userId = req.user.userId;
  await deleteProfile(userId);
  res.status(204).send();
};
