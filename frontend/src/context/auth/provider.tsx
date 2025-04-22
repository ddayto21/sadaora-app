// src/context/auth/provider.tsx
import { useEffect, useState, ReactNode } from "react";
import { checkAuth } from "../../api/auth";
import { AuthContext } from "./instance";

import type { AuthUser } from "../../types/user";

/**
 * This provider is designed to be wrapped around the application and manages user authentication state.
 *
 * - Calls `/api/auth/me` on mount to check if the user is logged in.
 * - Stores the user object in React context if authenticated.
 * - Makes `user`, `setUser`, and `loading` available via `useAuth()` hook.
 *
 * Used in `App.tsx` to wrap all routes and enable global access to auth state.
 */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
