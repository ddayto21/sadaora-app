// src/controllers/auth.controller.ts

import express, { Request, Response } from "express";

/** Handles input validation and calls the authentication service */

export async function signup(request: Request, response: Response) {
  const { email, password } = request.body;
  const result = await authService.createUser(email, password);
  response.status(201).json(result);
}
