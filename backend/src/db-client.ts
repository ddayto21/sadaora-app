// src/db-client.ts
import { PrismaClient } from "@prisma/client";

/**
 * PrismaClient is an auto-generated database client provided by Prisma.
 *
 * It exposes fully typed methods to interact with your database models
 * (e.g., `user.findMany()`, `profile.create()`) based on our schema.
 *
 * This instance is created once and reused throughout the application
 * to avoid opening multiple database connections.
 */

const databaseClient = new PrismaClient();

export default databaseClient;
