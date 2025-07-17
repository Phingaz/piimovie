import redis from './redis';

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
  keyPrefix?: string; // Redis key prefix
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  totalRequests: number;
}

export class Cache<T = unknown> {
  private readonly options: Required<CacheOptions>;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    hitRate: 0,
    totalRequests: 0,
  };
  private cleanupTimer?: NodeJS.Timeout;
  private statsKey: string;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl ?? 24 * 60 * 60 * 1000, // 24 hours default
      maxSize: options.maxSize ?? 1000, // 1000 entries default
      cleanupInterval: options.cleanupInterval ?? 24 * 60 * 60 * 1000, // 24 hours default
      enableStats: options.enableStats ?? true,
      keyPrefix: options.keyPrefix ?? 'cache:',
    };

    this.statsKey = `${this.options.keyPrefix}stats`;

    // Initialize stats from Redis if enabled
    if (this.options.enableStats) {
      this.loadStats();
    }

    // Start automatic cleanup if enabled
    if (this.options.cleanupInterval > 0) {
      this.startAutoCleanup();
    }
  }

  async get(key: string): Promise<T | null> {
    const redisKey = this.getRedisKey(key);

    if (this.options.enableStats) {
      this.stats.totalRequests++;
    }

    try {
      const entryStr = await redis.get(redisKey);

      if (!entryStr) {
        if (this.options.enableStats) {
          this.stats.misses++;
          this.updateHitRate();
          await this.saveStats();
        }
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(entryStr);
      const now = Date.now();

      // Check if entry has expired
      if (now - entry.timestamp > this.options.ttl) {
        await redis.del(redisKey);
        if (this.options.enableStats) {
          this.stats.misses++;
          this.stats.size = Math.max(0, this.stats.size - 1);
          this.updateHitRate();
          await this.saveStats();
        }
        return null;
      }

      // Update access statistics
      entry.accessCount++;
      entry.lastAccessed = now;

      // Update the entry in Redis
      await redis.setex(redisKey, Math.ceil(this.options.ttl / 1000), JSON.stringify(entry));

      if (this.options.enableStats) {
        this.stats.hits++;
        this.updateHitRate();
        await this.saveStats();
      }

      return entry.data;
    } catch (error) {
      console.error('Cache get error:', error);
      if (this.options.enableStats) {
        this.stats.misses++;
        this.updateHitRate();
        await this.saveStats();
      }
      return null;
    }
  }

  async set(key: string, data: T): Promise<void> {
    const redisKey = this.getRedisKey(key);
    const now = Date.now();

    // Check if we need to make room
    const currentSize = await this.size();
    const exists = await redis.exists(redisKey);

    if (currentSize >= this.options.maxSize && !exists) {
      await this.evictLeastRecentlyUsed();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now,
    };

    try {
      await redis.setex(redisKey, Math.ceil(this.options.ttl / 1000), JSON.stringify(entry));

      if (this.options.enableStats && !exists) {
        this.stats.size++;
        await this.saveStats();
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async has(key: string): Promise<boolean> {
    const redisKey = this.getRedisKey(key);

    try {
      const entryStr = await redis.get(redisKey);
      if (!entryStr) return false;

      const entry: CacheEntry<T> = JSON.parse(entryStr);
      const now = Date.now();

      if (now - entry.timestamp > this.options.ttl) {
        await redis.del(redisKey);
        if (this.options.enableStats) {
          this.stats.size = Math.max(0, this.stats.size - 1);
          await this.saveStats();
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error('Cache has error:', error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    const redisKey = this.getRedisKey(key);

    try {
      const deleted = await redis.del(redisKey);
      if (deleted > 0 && this.options.enableStats) {
        this.stats.size = Math.max(0, this.stats.size - 1);
        await this.saveStats();
      }
      return deleted > 0;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      const pattern = `${this.options.keyPrefix}*`;
      const keys = await redis.keys(pattern);

      if (keys.length > 0) {
        await redis.del(...keys);
      }

      if (this.options.enableStats) {
        this.stats.size = 0;
        await this.saveStats();
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  async resetStats(): Promise<void> {
    this.stats = {
      hits: 0,
      misses: 0,
      size: await this.size(),
      hitRate: 0,
      totalRequests: 0,
    };

    if (this.options.enableStats) {
      await this.saveStats();
    }
  }

  async size(): Promise<number> {
    try {
      const pattern = `${this.options.keyPrefix}*`;
      const keys = await redis.keys(pattern);
      // Filter out the stats key
      const cacheKeys = keys.filter((key) => key !== this.statsKey);
      return cacheKeys.length;
    } catch (error) {
      console.error('Cache size error:', error);
      return 0;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const pattern = `${this.options.keyPrefix}*`;
      const redisKeys = await redis.keys(pattern);
      // Filter out the stats key and remove prefix
      return redisKeys.filter((key) => key !== this.statsKey).map((key) => key.replace(this.options.keyPrefix, ''));
    } catch (error) {
      console.error('Cache keys error:', error);
      return [];
    }
  }

  async cleanup(): Promise<number> {
    const now = Date.now();
    let deletedCount = 0;

    try {
      const pattern = `${this.options.keyPrefix}*`;
      const keys = await redis.keys(pattern);
      const cacheKeys = keys.filter((key) => key !== this.statsKey);

      for (const redisKey of cacheKeys) {
        const entryStr = await redis.get(redisKey);
        if (entryStr) {
          const entry: CacheEntry<T> = JSON.parse(entryStr);
          if (now - entry.timestamp > this.options.ttl) {
            await redis.del(redisKey);
            deletedCount++;
          }
        }
      }

      if (this.options.enableStats) {
        this.stats.size = Math.max(0, this.stats.size - deletedCount);
        await this.saveStats();
      }
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }

    return deletedCount;
  }

  async getEntriesByAccess(): Promise<Array<[string, CacheEntry<T>]>> {
    try {
      const pattern = `${this.options.keyPrefix}*`;
      const keys = await redis.keys(pattern);
      const cacheKeys = keys.filter((key) => key !== this.statsKey);

      const entries: Array<[string, CacheEntry<T>]> = [];

      for (const redisKey of cacheKeys) {
        const entryStr = await redis.get(redisKey);
        if (entryStr) {
          const entry: CacheEntry<T> = JSON.parse(entryStr);
          const originalKey = redisKey.replace(this.options.keyPrefix, '');
          entries.push([originalKey, entry]);
        }
      }

      return entries.sort((a, b) => b[1].lastAccessed - a[1].lastAccessed);
    } catch (error) {
      console.error('Cache getEntriesByAccess error:', error);
      return [];
    }
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
  }

  private getRedisKey(key: string): string {
    return `${this.options.keyPrefix}${key}`;
  }

  private async evictLeastRecentlyUsed(): Promise<void> {
    try {
      const entries = await this.getEntriesByAccess();
      if (entries.length > 0) {
        const oldestKey = entries[entries.length - 1][0];
        await this.delete(oldestKey);
      }
    } catch (error) {
      console.error('Cache eviction error:', error);
    }
  }

  private updateHitRate(): void {
    if (this.stats.totalRequests > 0) {
      this.stats.hitRate = (this.stats.hits / this.stats.totalRequests) * 100;
    }
  }

  private async loadStats(): Promise<void> {
    try {
      const statsStr = await redis.get(this.statsKey);
      if (statsStr) {
        this.stats = JSON.parse(statsStr);
      }
    } catch (error) {
      console.error('Cache loadStats error:', error);
    }
  }

  private async saveStats(): Promise<void> {
    try {
      await redis.setex(this.statsKey, 86400, JSON.stringify(this.stats)); // Keep stats for 24 hours
    } catch (error) {
      console.error('Cache saveStats error:', error);
    }
  }

  private startAutoCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup().catch((error) => {
        console.error('Auto cleanup error:', error);
      });
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
    let argsStr: string;

    if (typeof args === 'object' && args !== null) {
      if (Array.isArray(args)) {
        argsStr = JSON.stringify(args);
      } else {
        const keys = Object.keys(args).sort();
        const sortedPairs = keys.map((key) => `"${key}":${JSON.stringify((args as Record<string, unknown>)[key])}`);
        argsStr = `{${sortedPairs.join(',')}}`;
      }
    } else {
      argsStr = JSON.stringify(args);
    }

    return `${url}:${argsStr}`;
  } catch {
    return `${url}:${String(args)}`;
  }
}

// Use globalThis to persist cache across hot reloads in development
const globalForCache = globalThis as unknown as {
  __apiCache: Cache | undefined;
};

export const apiCache =
  globalForCache.__apiCache ?? (globalForCache.__apiCache = new Cache({ enableStats: true, keyPrefix: 'piimovies:' }));
