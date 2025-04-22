import { Request, Response, RequestHandler } from "express";
import { getProfileService } from "../services/feed.service";
/**
/** Retrieve every single existing profile to display in feed */

export const feedHandler: RequestHandler = async (
  request: Request,
  response: Response
) => {
  //   const { user, params } = request;
  //   const { userId } = params;
  // Check if the user is authenticated
  //   if (!user) {
  //     return response.status(401).json({ message: "Unauthorized" });
  //   }
  //   // Check if the userId is provided
  //   if (!userId) {
  //     return response.status(400).json({ message: "User ID is required" });
  //   }
  const profiles = await getProfileService();
  response.status(200).json(profiles);
};
