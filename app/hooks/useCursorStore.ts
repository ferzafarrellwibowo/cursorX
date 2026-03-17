"use client";

import { useState, useEffect, useCallback } from "react";
import { CursorData, CursorCategory } from "../data/cursors";
import { supabase } from "../utils/supabase";

export function useCursorStore() {
  const [cursors, setCursors] = useState<CursorData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch all cursors from Supabase
  const fetchCursors = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("cursors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        setCursors(data);
      }
    } catch (error: any) {
      console.error("Error fetching cursors from Supabase:", error.message || error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchCursors();
  }, [fetchCursors]);

  const addCursor = useCallback(async (cursor: Omit<CursorData, "id">) => {
    // Generate a temporary ID for immediate UI feedback (Optimistic Update)
    const tempId = `temp-${Date.now()}`;
    const newCursor = { ...cursor, id: tempId };

    setCursors((prev) => [newCursor, ...prev]);

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
        setCursors((prev) => prev.map((c) => (c.id === tempId ? data : c)));
      }
      return data;
    } catch (error: any) {
      console.error("Error adding cursor to Supabase:", error.message || error);
      // Revert optimistic update on failure
      setCursors((prev) => prev.filter((c) => c.id !== tempId));
      return null;
    }
  }, []);

  const deleteCursor = useCallback(
    async (id: string) => {
      // Optimistic update
      setCursors((prev) => prev.filter((c) => c.id !== id));

      try {
        const { error } = await supabase.from("cursors").delete().eq("id", id);
        if (error) throw error;
      } catch (error: any) {
        console.error("Error deleting cursor from Supabase:", error.message || error);
        // Revert on failure by refetching
        fetchCursors();
      }
    },
    [fetchCursors]
  );

  return {
    cursors: cursors,
    customCursors: cursors, // We call everything custom now
    addCursor,
    deleteCursor,
    isLoaded,
  };
}

export type { CursorData, CursorCategory };
