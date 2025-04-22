// src/api/auth.ts

import type { AuthUser } from "../types/user";

/**
 * Sends a POST request to `/api/auth/signup` route to create a new user account.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to the response from the server.
 *
 */

export const signup = async (
  email: string,
  password: string
): Promise<void> => {
  const res = await fetch("http://localhost:3001/api/auth/signup", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to sign up");
  }
  console.log("User signed up successfully");
};
/**
 * Sends a POST request to `/api/auth/login` route to log in an existing user.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to the response from the server.
 *
 */
export const login = async (email: string, password: string): Promise<void> => {
  const response = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to log in");
  }
};

export const logout = async (): Promise<void> => {
  const response = await fetch("http://localhost:3001/api/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to log out");
  }
  console.log("User logged out successfully");
};

/**
 * Checks if the user is authenticated by calling `/api/auth/me`.
 *
 * @returns A promise that resolves with the user object if authenticated,
 * or throws an error if the user is not authenticated.
 */

export const checkAuth = async (): Promise<AuthUser> => {
  const response = await fetch("http://localhost:3001/api/auth/me", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("User is not authenticated");
  }

  return await response.json();
};
