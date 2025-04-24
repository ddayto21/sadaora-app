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

import authRoutes from "./routes/auth.route";
import profileRoutes from "./routes/profile.route";
import feedRoutes from "./routes/feed.route";
import docRoutes from "./routes/docs.route";

import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const openApiSpecification = YAML.load("./docs/openapi.yaml");

const PORT = 3001;

const app = express();

// Serve webpage for openapi documentation
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpecification, {
    customCssUrl: "./docs/openapi-custom.css",
    customSiteTitle: "📘 CRUD API Documentation",
    explorer: true,
  })
);

// Serve raw OpenAPI YAML for ReDoc
app.use(
  "/openapi.yaml",
  express.static(path.join(__dirname, "../docs/openapi.yaml"))
);

// Serve raw OpenAPI YAML for ReDoc
app.use("/docs", docRoutes);

// Global Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Base test route
app.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running...");
});

// Mount application routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/feed", feedRoutes);

// Run the backend server
app.listen(PORT, () => {
  console.log(`Hosting backend server at: http://localhost:${PORT}`);
});

export default app;
