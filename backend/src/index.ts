/** Setup a backend server using express */

// src/index.ts

import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";

import { PrismaClient } from "@prisma/client";
const databaseClient = new PrismaClient();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

/**
 * @route POST /api/auth/signup
 * @description Registers a new user with email and password.
 *              Hashes the password using bcrypt before storing it in the database.
 *              Returns the created user's ID.
 * @access Public
 */
app.post("/api/auth/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await databaseClient.user.create({
      data: { email, password: hashedPassword },
    });

    res
      .status(201)
      .json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Email already exists or is invalid" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
