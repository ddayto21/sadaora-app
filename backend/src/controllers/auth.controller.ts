// src/controllers/auth.controller.ts

/**
 * Translated HTTP requests into service calls
 * - Handles validation, response shaping, and error formatting
 * around the service logic
 */

import express, { Request, Response } from "express";
import { createUser, verifyUser } from "../services/auth.services";

/**
 * Handles incoming signup requests.
 *
 * Extracts the email and password from the request body,
 * and delegates the user creation to the `createUser` service in `auth.services.ts`.
 * Responds with a 201 status and newly created user.
 *
 * @param request - Exptress HTTP request containin the `email` and `password`
 * @param response - Express HTTP response used to return status and data
 *
 */
export async function signup(request: Request, response: Response) {
  const { email, password } = request.body;
  const result = await createUser(email, password);
  response.status(201).json(result);
}

/**
 * Handles incoming login requests.
 *
 * Extracts the `email` and password from the request body,
 * then calls the `verifyUser` service to validate credentials.
 * Returns the user object on success, or a `401 error` on failure.
 *
 * @param request - Express HTTP request with `email` and `passwrod`
 * @param response - Express HTTP response used to return status and data
 */

export async function login(request: Request, response: Response) {
  const { email, password } = request.body;
  const user = await verifyUser(email, password);
  if (!user) {
    return response.status(401).json({ error: "Invalid email or password" });
  }

  return response.status(200).json(user);
}
