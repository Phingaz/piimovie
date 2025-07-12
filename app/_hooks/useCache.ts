import { useState, useEffect, useCallback } from 'react';
import { CacheStats } from '@/lib/cache';

interface CacheDebugInfo {
  stats: CacheStats;
  size: number;
  totalKeys: number;
  keys: string[];
  topAccessed: Array<{
    key: string;
    accessCount: number;
    lastAccessed: string;
  }>;
}

interface UseCacheReturn {
  stats: CacheStats | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  clearCache: () => Promise<void>;
  clearByPattern: (pattern: string) => Promise<number>;
  cleanup: () => Promise<number>;
  resetStats: () => Promise<void>;
  debugInfo: CacheDebugInfo | null;
  fetchDebugInfo: () => Promise<void>;
}

export const useCache = (): UseCacheReturn => {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [debugInfo, setDebugInfo] = useState<CacheDebugInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/cache?action=stats');
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.message || 'Failed to fetch cache stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cache stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCache = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      await fetchStats(); // Refresh stats after clearing
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cache');
      throw err;
    }
  }, [fetchStats]);

  const clearByPattern = useCallback(
    async (pattern: string) => {
      try {
        setError(null);
        const response = await fetch('/api/cache', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'clearPattern', pattern }),
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message);
        }

        await fetchStats(); // Refresh stats after clearing
        return result.data.deletedCount;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to clear cache by pattern');
        throw err;
      }
    },
    [fetchStats],
  );

  const cleanup = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup' }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      await fetchStats(); // Refresh stats after cleanup
      return result.data.cleanedCount;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cleanup cache');
      throw err;
    }
  }, [fetchStats]);

  const resetStats = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resetStats' }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      await fetchStats(); // Refresh stats after reset
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset cache stats');
      throw err;
    }
  }, [fetchStats]);

  const fetchDebugInfo = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/cache?action=debug');
      const result = await response.json();

      if (result.success) {
        setDebugInfo(result.data);
      } else {
        setError(result.message || 'Failed to fetch debug info');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch debug info');
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchDebugInfo();
    const interval = setInterval(() => {
      fetchStats();
      fetchDebugInfo();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchStats, fetchDebugInfo]);

  return {
    stats,
    debugInfo,
    isLoading,
    error,
    refresh: fetchStats,
    clearCache,
    clearByPattern,
    cleanup,
    resetStats,
    fetchDebugInfo,
  };
};

export default useCache;
