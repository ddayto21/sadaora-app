// src/hooks/useAuth.ts

import { useContext } from "react";
import { AuthContext } from "../context/auth/instance";

/**
 * useAuth hook provides access to the current user's auth state.
 * It returns the user object, loading state, and setUser function.
 * Must be used within a component wrapped by `<AuthProvider>`.
 */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
