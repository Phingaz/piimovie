import { useState, useEffect, useCallback } from 'react';
import { CacheStats } from '@/lib/cache';

interface UseCacheReturn {
  stats: CacheStats | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  clearCache: () => Promise<void>;
  clearByPattern: (pattern: string) => Promise<number>;
  cleanup: () => Promise<number>;
  resetStats: () => Promise<void>;
}

export const useCache = (): UseCacheReturn => {
  const [stats, setStats] = useState<CacheStats | null>(null);
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

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 20000); // Refresh every 20 seconds
    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refresh: fetchStats,
    clearCache,
    clearByPattern,
    cleanup,
    resetStats,
  };
};

export default useCache;
