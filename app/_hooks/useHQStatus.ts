'use client';
import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { Cache } from '@/lib/cache';

interface HQResponse {
  query: string;
  hasHQ: boolean;
  duration: number;
}

const HQ_API_URL = '/api/hq-check';

const hqCache = new Cache<boolean>({
  ttl: 1000 * 60 * 60 * 24 * 7,
  cleanupInterval: 1000 * 60 * 60 * 24,
  maxSize: 1000,
  enableStats: true,
});

export const useHQStatus = (movieTitle?: string) => {
  const [hqStatus, setHqStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHQAvailability = useCallback(async (title: string): Promise<boolean | null> => {
    if (!title?.trim()) return null;

    const cacheKey = title.toLowerCase().trim();
    const cachedResult = hqCache.get(cacheKey);

    if (cachedResult !== null) {
      return cachedResult;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(HQ_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: title }),
      });

      if (!response.ok) {
        throw new Error(`HQ API error: ${response.status}`);
      }

      const data: HQResponse = await response.json();

      // Cache the result
      hqCache.set(cacheKey, data.hasHQ);

      return data.hasHQ;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check HQ availability';
      setError(errorMessage);
      logger.error('HQ availability check failed:', { title, error: errorMessage });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (movieTitle) {
      checkHQAvailability(movieTitle).then(setHqStatus);
    }
  }, [movieTitle, checkHQAvailability]);

  return {
    hqStatus,
    loading,
    error,
    checkHQAvailability,
  };
};

// Hook for bulk checking multiple movies
export const useBulkHQStatus = () => {
  const [hqStatuses, setHqStatuses] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const checkMultipleHQ = useCallback(async (titles: string[]) => {
    if (!titles.length) return;

    setLoading(true);
    const results: Record<string, boolean> = {};

    // Check cache first and separate uncached titles
    const uncachedTitles: string[] = [];
    titles.forEach((title) => {
      const cacheKey = title.toLowerCase().trim();
      const cachedResult = hqCache.get(cacheKey);

      if (cachedResult !== null) {
        results[title] = cachedResult;
      } else {
        uncachedTitles.push(title);
      }
    });

    // If we have uncached titles, use the multiple query endpoint
    if (uncachedTitles.length > 0) {
      try {
        const response = await fetch('/api/hq-check/multiple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ queries: uncachedTitles }),
        });

        if (response.ok) {
          const data: { results: Array<{ query: string; hasHQ: boolean; duration: number }> } = await response.json();

          // Cache results and update state
          data.results.forEach(({ query, hasHQ }) => {
            const cacheKey = query.toLowerCase().trim();
            hqCache.set(cacheKey, hasHQ);
            results[query] = hasHQ;
          });
        } else {
          logger.error('Multiple HQ check API error:', { status: response.status, statusText: response.statusText });
          // Set default false for failed queries
          uncachedTitles.forEach((title) => {
            results[title] = false;
          });
        }
      } catch (err) {
        logger.error('Multiple HQ check failed:', { error: err, uncachedTitles });
        // Set default false for failed queries
        uncachedTitles.forEach((title) => {
          results[title] = false;
        });
      }
    }

    setHqStatuses((prev) => ({ ...prev, ...results }));
    setLoading(false);
  }, []);

  return {
    hqStatuses,
    loading,
    checkMultipleHQ,
  };
};
