interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  prefix?: string;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = "cursorx_cache_";

class CacheManager {
  private memoryCache: Map<string, CacheItem<unknown>> = new Map();
  private prefix: string;
  private defaultTTL: number;

  constructor(config: CacheConfig = {}) {
    this.prefix = config.prefix || CACHE_PREFIX;
    this.defaultTTL = config.ttl || DEFAULT_TTL;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private isClient(): boolean {
    return typeof window !== "undefined";
  }

  /**
   * Get data from cache (memory first, then localStorage)
   */
  get<T>(key: string): T | null {
    const fullKey = this.getKey(key);
    const now = Date.now();

    // Check memory cache first
    const memoryItem = this.memoryCache.get(fullKey) as CacheItem<T> | undefined;
    if (memoryItem && memoryItem.expiresAt > now) {
      return memoryItem.data;
    }

    // Check localStorage
    if (this.isClient()) {
      try {
        const stored = localStorage.getItem(fullKey);
        if (stored) {
          const item: CacheItem<T> = JSON.parse(stored);
          if (item.expiresAt > now) {
            // Restore to memory cache
            this.memoryCache.set(fullKey, item);
            return item.data;
          } else {
            // Remove expired item
            localStorage.removeItem(fullKey);
          }
        }
      } catch (error) {
        console.warn("Cache read error:", error);
      }
    }

    // Clean up expired memory cache
    this.memoryCache.delete(fullKey);
    return null;
  }

  /**
   * Set data in cache (both memory and localStorage)
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const fullKey = this.getKey(key);
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt,
    };

    // Set in memory cache
    this.memoryCache.set(fullKey, item);

    // Set in localStorage
    if (this.isClient()) {
      try {
        localStorage.setItem(fullKey, JSON.stringify(item));
      } catch (error) {
        console.warn("Cache write error:", error);
        // If localStorage is full, clear old cache entries
        this.clearExpired();
      }
    }
  }

  /**
   * Remove specific key from cache
   */
  remove(key: string): void {
    const fullKey = this.getKey(key);
    this.memoryCache.delete(fullKey);

    if (this.isClient()) {
      try {
        localStorage.removeItem(fullKey);
      } catch (error) {
        console.warn("Cache remove error:", error);
      }
    }
  }

  /**
   * Invalidate cache (mark as stale, will refetch on next access)
   */
  invalidate(key: string): void {
    this.remove(key);
  }

  /**
   * Clear all cache entries with this prefix
   */
  clear(): void {
    // Clear memory cache
    this.memoryCache.clear();

    // Clear localStorage entries with this prefix
    if (this.isClient()) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
      } catch (error) {
        console.warn("Cache clear error:", error);
      }
    }
  }

  /**
   * Clear expired entries only
   */
  clearExpired(): void {
    const now = Date.now();

    // Clear expired memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.expiresAt <= now) {
        this.memoryCache.delete(key);
      }
    }

    // Clear expired localStorage entries
    if (this.isClient()) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            const stored = localStorage.getItem(key);
            if (stored) {
              const item: CacheItem<unknown> = JSON.parse(stored);
              if (item.expiresAt <= now) {
                keysToRemove.push(key);
              }
            }
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
      } catch (error) {
        console.warn("Cache clearExpired error:", error);
      }
    }
  }

  /**
   * Check if cache has valid data
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get cache stats
   */
  getStats(): { memorySize: number; localStorageSize: number } {
    let localStorageSize = 0;

    if (this.isClient()) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          localStorageSize++;
        }
      }
    }

    return {
      memorySize: this.memoryCache.size,
      localStorageSize,
    };
  }
}

// Cache keys
export const CACHE_KEYS = {
  CURSORS: "cursors",
  FAVORITES: "favorites",
} as const;

// Default cache instance
export const cache = new CacheManager();

// Export class for custom instances
export { CacheManager };
export type { CacheItem, CacheConfig };
