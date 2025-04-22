/**
 * src/router/protected-route.tsx
 *
 * A higher-order component that protects routes from being accessed by unauthenticated users.
 *
 * ✅ How it works:
 * - When the component mounts, it sends a GET request to `/api/auth/me` to check if the user is logged in.
 * - If the request succeeds, it sets `authenticated = true` and renders the child route.
 * - If the request fails (e.g. user is not logged in or token is invalid), it redirects to the `/login` page.
 * - During the initial fetch, it renders `null` (can be replaced with a loading spinner).
 *
 * @param children - The protected route component to render if authenticated
 * @returns The child component if the user is authenticated, otherwise redirects to /login
 */

import { checkAuth } from "../api/auth";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth()
      .then(() => {
        setAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        setAuthenticated(false);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  return authenticated ? children : <Navigate to="/login" replace />;
};
