"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CursorData, CursorCategory } from "../data/cursors";
import { supabase } from "../utils/supabase";
import { cache, CACHE_KEYS } from "../utils/cache";

// Cache TTL: 5 minutes for cursors data
const CURSORS_CACHE_TTL = 5 * 60 * 1000;

export function useCursorStore() {
  const [cursors, setCursors] = useState<CursorData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCacheHit, setIsCacheHit] = useState(false);
  const fetchInProgress = useRef(false);

  // Fetch from network and update cache
  const fetchFromNetwork = useCallback(async (): Promise<CursorData[] | null> => {
    if (!supabase) {
      console.warn("Supabase not configured. Using empty cursor list.");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("cursors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        // Update cache with fresh data
        cache.set(CACHE_KEYS.CURSORS, data, CURSORS_CACHE_TTL);
        return data;
      }
      return null;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : JSON.stringify(error);
      console.error("Error fetching cursors from Supabase:", message);
      return null;
    }
  }, []);

  // Fetch all cursors - cache first, then network
  const fetchCursors = useCallback(async (forceRefresh = false) => {
    // Prevent duplicate fetches
    if (fetchInProgress.current) return;
    fetchInProgress.current = true;

    try {
      // Try cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = cache.get<CursorData[]>(CACHE_KEYS.CURSORS);
        if (cachedData) {
          setCursors(cachedData);
          setIsLoaded(true);
          setIsCacheHit(true);

          // Background refresh for stale-while-revalidate pattern
          fetchFromNetwork().then((freshData) => {
            if (freshData) {
              setCursors(freshData);
            }
          });
          return;
        }
      }

      // No cache or force refresh - fetch from network
      setIsCacheHit(false);
      const data = await fetchFromNetwork();
      if (data) {
        setCursors(data);
      }
    } finally {
      setIsLoaded(true);
      fetchInProgress.current = false;
    }
  }, [fetchFromNetwork]);

  useEffect(() => {
    fetchCursors();
  }, [fetchCursors]);

  const addCursor = useCallback(async (cursor: Omit<CursorData, "id">) => {
    // Generate a temporary ID for immediate UI feedback (Optimistic Update)
    const tempId = `temp-${Date.now()}`;
    const newCursor = { ...cursor, id: tempId };

    // Update state immediately
    setCursors((prev) => {
      const updated = [newCursor, ...prev];
      // Update cache with optimistic data
      cache.set(CACHE_KEYS.CURSORS, updated, CURSORS_CACHE_TTL);
      return updated;
    });

    if (!supabase) {
      console.warn("Supabase not configured. Cursor added locally only.");
      return newCursor;
    }

    try {
      // Send to Supabase
      const { data, error } = await supabase
        .from("cursors")
        .insert([cursor])
        .select()
        .single();

      if (error) throw error;

      // Replace the temporary cursor with the real one from the database
      if (data) {
        setCursors((prev) => {
          const updated = prev.map((c) => (c.id === tempId ? data : c));
          // Update cache with confirmed data
          cache.set(CACHE_KEYS.CURSORS, updated, CURSORS_CACHE_TTL);
          return updated;
        });
      }
      return data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error adding cursor to Supabase:", message);
      // Revert optimistic update on failure
      setCursors((prev) => {
        const updated = prev.filter((c) => c.id !== tempId);
        cache.set(CACHE_KEYS.CURSORS, updated, CURSORS_CACHE_TTL);
        return updated;
      });
      return null;
    }
  }, []);

  const deleteCursor = useCallback(
    async (id: string) => {
      // Optimistic update
      setCursors((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        // Update cache immediately
        cache.set(CACHE_KEYS.CURSORS, updated, CURSORS_CACHE_TTL);
        return updated;
      });

      if (!supabase) {
        console.warn("Supabase not configured. Cursor deleted locally only.");
        return;
      }

      try {
        const { error } = await supabase.from("cursors").delete().eq("id", id);
        if (error) throw error;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error deleting cursor from Supabase:", message);
        // Revert on failure by refetching (will also update cache)
        fetchCursors(true);
      }
    },
    [fetchCursors]
  );

  // Force refresh - bypass cache
  const refreshCursors = useCallback(() => {
    cache.invalidate(CACHE_KEYS.CURSORS);
    return fetchCursors(true);
  }, [fetchCursors]);

  // Clear cache (useful for logout or manual cache clear)
  const clearCache = useCallback(() => {
    cache.clear();
  }, []);

  return {
    cursors: cursors,
    customCursors: cursors, // We call everything custom now
    addCursor,
    deleteCursor,
    refreshCursors,
    clearCache,
    isLoaded,
    isCacheHit,
  };
}

export type { CursorData, CursorCategory };
