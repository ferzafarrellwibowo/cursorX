"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { CursorData, CursorCategory } from "../data/cursors";
import { supabase } from "../utils/supabase";
import { cache, CACHE_KEYS } from "../utils/cache";

// Cache TTL: 5 minutes for cursors data
const CURSORS_CACHE_TTL = 5 * 60 * 1000;

interface CursorStoreState {
  cursors: CursorData[];
  customCursors: CursorData[];
  isLoaded: boolean;
  isCacheHit: boolean;
  fetchInProgress: boolean;
  addCursor: (cursor: Omit<CursorData, "id">) => Promise<CursorData | null>;
  deleteCursor: (id: string) => Promise<void>;
  fetchCursors: (forceRefresh?: boolean) => Promise<void>;
  refreshCursors: () => Promise<void>;
  clearCache: () => void;
}

const useCursorStoreBase = create<CursorStoreState>((set, get) => ({
  cursors: [],
  customCursors: [],
  isLoaded: false,
  isCacheHit: false,
  fetchInProgress: false,

  fetchCursors: async (forceRefresh = false) => {
    const { fetchInProgress } = get();
    if (fetchInProgress) return;

    set({ fetchInProgress: true });

    try {
      if (!forceRefresh) {
        const cachedData = cache.get<CursorData[]>(CACHE_KEYS.CURSORS);
        if (cachedData) {
          set({
            cursors: cachedData,
            customCursors: cachedData,
            isLoaded: true,
            isCacheHit: true,
            fetchInProgress: false,
          });

          // Background refresh for stale-while-revalidate pattern
          if (supabase) {
            supabase
              .from("cursors")
              .select("id, name, image, imageId, category, color, creator")
              .order("created_at", { ascending: false })
              .limit(1000)
              .then(({ data, error }) => {
                if (!error && data) {
                  cache.set(CACHE_KEYS.CURSORS, data, CURSORS_CACHE_TTL);
                  set({ cursors: data, customCursors: data });
                }
              });
          }
          return;
        }
      }

      set({ isCacheHit: false });

      if (!supabase) {
        console.warn("Supabase not configured. Using empty cursor list.");
        set({ isLoaded: true, fetchInProgress: false });
        return;
      }

      const { data, error } = await supabase
        .from("cursors")
        .select("id, name, image, imageId, category, color, creator")
        .order("created_at", { ascending: false })
        .limit(1000);

      if (error) throw error;

      if (data) {
        cache.set(CACHE_KEYS.CURSORS, data, CURSORS_CACHE_TTL);
        set({ cursors: data, customCursors: data, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (error: unknown) {
      console.error("Error fetching cursors from Supabase:", JSON.stringify(error, null, 2));
      set({ isLoaded: true });
    } finally {
      set({ fetchInProgress: false });
    }
  },

  addCursor: async (cursor: Omit<CursorData, "id">) => {
    // Generate a temporary ID for immediate UI feedback (Optimistic Update)
    const tempId = `temp-${Date.now()}`;
    const newCursor = { ...cursor, id: tempId } as CursorData;

    set((state) => {
      const updated = [newCursor, ...state.cursors];
      cache.set(CACHE_KEYS.CURSORS, updated, CURSORS_CACHE_TTL);
      return { cursors: updated, customCursors: updated };
    });

    if (!supabase) {
      console.warn("Supabase not configured. Cursor added locally only.");
      return newCursor;
    }

    try {
      const res = await fetch("/api/admin/cursors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cursor),
      });

      const { success, data, error } = await res.json();
      if (!success) throw new Error(error || "Failed to insert cursor");

      if (data) {
        set((state) => {
          const updated = state.cursors.map((c) =>
            c.id === tempId ? data : c
          );
          cache.set(CACHE_KEYS.CURSORS, updated, CURSORS_CACHE_TTL);
          return { cursors: updated, customCursors: updated };
        });
      }
      return data;
    } catch (error: unknown) {
      console.error("Error adding cursor to Supabase:", error);
      set((state) => {
        const updated = state.cursors.filter((c) => c.id !== tempId);
        cache.set(CACHE_KEYS.CURSORS, updated, CURSORS_CACHE_TTL);
        return { cursors: updated, customCursors: updated };
      });
      return null;
    }
  },

  deleteCursor: async (id: string) => {
    set((state) => {
      const updated = state.cursors.filter((c) => c.id !== id);
      cache.set(CACHE_KEYS.CURSORS, updated, CURSORS_CACHE_TTL);
      return { cursors: updated, customCursors: updated };
    });

    if (!supabase) {
      console.warn("Supabase not configured. Cursor deleted locally only.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/cursors?id=${id}`, {
        method: "DELETE",
      });
      const { success, error } = await res.json();
      if (!success) throw new Error(error || "Failed to delete cursor");
    } catch (error: unknown) {
      console.error("Error deleting cursor from Supabase:", error);
      get().fetchCursors(true);
    }
  },

  refreshCursors: async () => {
    cache.invalidate(CACHE_KEYS.CURSORS);
    return get().fetchCursors(true);
  },

  clearCache: () => {
    cache.clear();
  },
}));

export function useCursorStore() {
  const store = useCursorStoreBase();

  useEffect(() => {
    if (!store.isLoaded && !store.fetchInProgress) {
      store.fetchCursors();
    }
  }, [store.isLoaded, store.fetchInProgress, store.fetchCursors]);

  return store;
}

export type { CursorData, CursorCategory };
