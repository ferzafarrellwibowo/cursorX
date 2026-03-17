"use client";

import { useState, useEffect, useCallback } from "react";

const ADMIN_STORAGE_KEY = "cursorx-admin-session";

// Simple admin credentials (in production, use proper auth)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

export function useAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (session === "authenticated") {
        setIsLoggedIn(true);
      }
    } catch {
      // localStorage not available
    }
    setIsLoaded(true);
  }, []);

  const login = useCallback(
    (username: string, password: string): { success: boolean; error?: string } => {
      if (
        username === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password
      ) {
        setIsLoggedIn(true);
        try {
          localStorage.setItem(ADMIN_STORAGE_KEY, "authenticated");
        } catch {
          // localStorage not available
        }
        return { success: true };
      }
      return { success: false, error: "Invalid username or password" };
    },
    []
  );

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch {
      // localStorage not available
    }
  }, []);

  return { isLoggedIn, isLoaded, login, logout };
}
