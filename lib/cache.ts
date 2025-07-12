export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  cleanupInterval?: number; // Auto cleanup interval in milliseconds
  enableStats?: boolean; // Enable cache statistics
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  totalRequests: number;
}

export class Cache<T = unknown> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly options: Required<CacheOptions>;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    hitRate: 0,
    totalRequests: 0,
  };
  private cleanupTimer?: NodeJS.Timeout;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl ?? 10 * 60 * 1000, // 10 minutes default
      maxSize: options.maxSize ?? 1000, // 1000 entries default
      cleanupInterval: options.cleanupInterval ?? 5 * 60 * 1000, // 5 minutes default
      enableStats: options.enableStats ?? true,
    };

    // Start automatic cleanup if enabled
    if (this.options.cleanupInterval > 0) {
      this.startAutoCleanup();
    }
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    const now = Date.now();

    if (this.options.enableStats) {
      this.stats.totalRequests++;
    }

    if (!entry) {
      if (this.options.enableStats) {
        this.stats.misses++;
        this.updateHitRate();
      }
      return null;
    }

    // Check if entry has expired
    if (now - entry.timestamp > this.options.ttl) {
      this.cache.delete(key);
      if (this.options.enableStats) {
        this.stats.misses++;
        this.stats.size = this.cache.size;
        this.updateHitRate();
      }
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;

    if (this.options.enableStats) {
      this.stats.hits++;
      this.updateHitRate();
    }

    return entry.data;
  }

  set(key: string, data: T): void {
    const now = Date.now();

    // Check if we need to make room
    if (this.cache.size >= this.options.maxSize && !this.cache.has(key)) {
      this.evictLeastRecentlyUsed();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now,
    };

    this.cache.set(key, entry);

    if (this.options.enableStats) {
      this.stats.size = this.cache.size;
    }
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > this.options.ttl) {
      this.cache.delete(key);
      if (this.options.enableStats) {
        this.stats.size = this.cache.size;
      }
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted && this.options.enableStats) {
      this.stats.size = this.cache.size;
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    if (this.options.enableStats) {
      this.stats.size = 0;
    }
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      size: this.cache.size,
      hitRate: 0,
      totalRequests: 0,
    };
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  cleanup(): number {
    const now = Date.now();
    let deletedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.options.ttl) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    if (this.options.enableStats) {
      this.stats.size = this.cache.size;
    }

    return deletedCount;
  }

  getEntriesByAccess(): Array<[string, CacheEntry<T>]> {
    return Array.from(this.cache.entries()).sort((a, b) => b[1].lastAccessed - a[1].lastAccessed);
  }

  updateOptions(newOptions: Partial<CacheOptions>): void {
    Object.assign(this.options, newOptions);

    // Restart cleanup timer if interval changed
    if (newOptions.cleanupInterval !== undefined) {
      this.stopAutoCleanup();
      if (this.options.cleanupInterval > 0) {
        this.startAutoCleanup();
      }
    }
  }

  destroy(): void {
    this.stopAutoCleanup();
    this.clear();
  }

  private evictLeastRecentlyUsed(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private updateHitRate(): void {
    if (this.stats.totalRequests > 0) {
      this.stats.hitRate = (this.stats.hits / this.stats.totalRequests) * 100;
    }
  }

  private startAutoCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.options.cleanupInterval);
  }

  private stopAutoCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }
}
export function generateCacheKey(url: string, args?: unknown): string {
  if (!args) return url;

  try {
    // Sort object keys for consistent cache keys
    const sortedArgs =
      typeof args === 'object' && args !== null ? JSON.stringify(args, Object.keys(args).sort()) : JSON.stringify(args);

    return `${url}:${sortedArgs}`;
  } catch {
    // Fallback if JSON.stringify fails
    return `${url}:${String(args)}`;
  }
}

// Use globalThis to persist cache across hot reloads in development
const globalForCache = globalThis as unknown as {
  __apiCache: Cache | undefined;
};

export const apiCache =
  globalForCache.__apiCache ??
  (globalForCache.__apiCache = new Cache({
    ttl: 10 * 60 * 1000, // 10 minutes
    maxSize: 500,
    cleanupInterval: 5 * 60 * 1000,
    enableStats: true,
  }));
