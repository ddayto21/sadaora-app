// src/index.ts

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

import authRoutes from "./routes/auth";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";

const PORT = 3001;

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the backend!");
});

// Mount all /api/auth routes
app.use("/api/auth", authRoutes);

// Run the server on port 3001
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

export default app;
