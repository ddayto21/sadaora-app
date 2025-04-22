// src/context/auth/instance.tsx
import { createContext } from "react";
import type { AuthUser } from "../../types/user";

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
