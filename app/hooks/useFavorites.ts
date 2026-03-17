"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "cursorx-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // localStorage not available
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch {
        // localStorage not available
      }
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = useCallback((cursorId: string) => {
    setFavorites((prev) =>
      prev.includes(cursorId)
        ? prev.filter((id) => id !== cursorId)
        : [...prev, cursorId]
    );
  }, []);

  const isFavorite = useCallback(
    (cursorId: string) => favorites.includes(cursorId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
