// src/index.ts

import authRoutes from "./routes/auth";

import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";

/**
 * Main entry point for the backend application.
 *
 * - Setups up an express service with middleware for CORS, JSON parsing, and cookie-handling.
 * - Connects to the PostgreSQL database using Prisma db client.
 * - Mounts the authentication route under `/api/auth`, whic handles signup and login.
 * - The `/signup` route accepts user credentials, validates them in the controller,
 * then delegates to the auth service to has password and save user in the database.
 * - Responds with newly created user on success.
 */

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

// Mount all /api/auth routes
app.use("/api/auth", authRoutes);

// Run the server on port 5000
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
