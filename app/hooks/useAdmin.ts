"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase";

export function useAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    checkSession();

    // Setup auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        // We map the "admin" username to a dummy email for Supabase Auth
        const email = username === "admin" ? "admin@cursorx.local" : username;

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { success: false, error: "Invalid username or password" };
        }

        if (data.session) {
          setIsLoggedIn(true);
          return { success: true };
        }

        return { success: false, error: "An unknown error occurred" };
      } catch (err: any) {
        return { success: false, error: err.message || "Login failed" };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, []);

  return { isLoggedIn, isLoaded, login, logout };
}
