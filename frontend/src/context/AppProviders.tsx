"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { api, clearTokens, setTokens } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
  loginWithGoogleIdToken: (idToken: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AppProviders({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const hasToken =
      typeof window !== "undefined" && window.localStorage.getItem("nuzio_access_token");
    if (!hasToken) {
      setUserState(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api.get<User>("/auth/me");
      setUserState(me);
    } catch {
      clearTokens();
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial session hydration from stored token
    refreshUser();
  }, [refreshUser]);

  const loginWithGoogleIdToken = useCallback(async (idToken: string) => {
    const result = await api.post<{ user: User; accessToken: string; refreshToken: string }>(
      "/auth/google",
      { idToken },
      { auth: false }
    );
    setTokens(result.accessToken, result.refreshToken);
    setUserState(result.user);
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore network errors on logout
    }
    clearTokens();
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, refreshUser, setUser: setUserState, loginWithGoogleIdToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AppProviders");
  return ctx;
}
