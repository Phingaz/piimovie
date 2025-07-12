import { apiCache } from './cache';
import { logger } from './logger';

export class CacheManager {
  static getStats() {
    return apiCache.getStats();
  }

  static getSize() {
    return apiCache.size();
  }

  static getKeys() {
    return apiCache.keys();
  }

  static clearAll() {
    apiCache.clear();
    logger.info('Cache cleared successfully');
  }

  static clearByPattern(pattern: string) {
    const keys = apiCache.keys();
    let deletedCount = 0;

    keys.forEach((key) => {
      if (key.includes(pattern)) {
        apiCache.delete(key);
        deletedCount++;
      }
    });

    logger.info(`Cleared ${deletedCount} cache entries matching pattern: ${pattern}`);
    return deletedCount;
  }

  static cleanup() {
    const deletedCount = apiCache.cleanup();
    logger.info(`Cleaned up ${deletedCount} expired cache entries`);
    return deletedCount;
  }

  static resetStats() {
    apiCache.resetStats();
    logger.info('Cache statistics reset');
  }

  static getEntriesByAccess() {
    return apiCache.getEntriesByAccess();
  }

  static getDebugInfo() {
    const stats = apiCache.getStats();
    const size = apiCache.size();
    const keys = apiCache.keys();

    return {
      stats,
      size,
      totalKeys: keys.length,
      keys: keys.slice(0, 10),
      topAccessed: apiCache
        .getEntriesByAccess()
        .slice(0, 5)
        .map(([key, entry]) => ({
          key,
          accessCount: entry.accessCount,
          lastAccessed: new Date(entry.lastAccessed).toISOString(),
        })),
    };
  }

  static async warmUp(entries: Array<{ key: string; fetchFn: () => Promise<unknown> }>) {
    logger.info(`Warming up cache with ${entries.length} entries...`);

    const results = await Promise.allSettled(
      entries.map(async ({ key, fetchFn }) => {
        try {
          const data = await fetchFn();
          apiCache.set(key, data);
          return { key, success: true };
        } catch (error) {
          logger.error(`Failed to warm up cache for key: ${key}`, { key }, error);
          return { key, success: false, error };
        }
      }),
    );

    const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
    logger.info(`Cache warm-up completed: ${successful}/${entries.length} entries loaded`);

    return {
      total: entries.length,
      successful,
      failed: entries.length - successful,
    };
  }

  static monitorPerformance() {
    const stats = apiCache.getStats();
    const { hitRate, totalRequests, size } = stats;

    if (totalRequests > 100) {
      if (hitRate < 50) {
        logger.warn(`Low cache hit rate: ${hitRate.toFixed(2)}%. Consider reviewing cache strategy.`);
      }

      if (size > 400) {
        logger.warn(`Cache size is getting large: ${size} entries. Consider reducing TTL or max size.`);
      }
    }

    return {
      status: hitRate >= 50 && size <= 400 ? 'healthy' : 'warning',
      recommendations: [
        ...(hitRate < 50 ? ['Increase cache TTL or review cache key generation'] : []),
        ...(size > 400 ? ['Reduce cache TTL or max size'] : []),
      ],
    };
  }
}

if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    (window as Window & { __cacheManager?: typeof CacheManager }).__cacheManager = CacheManager;
    logger.debug('Cache manager available at window.__cacheManager');
  }
}

export default CacheManager;
