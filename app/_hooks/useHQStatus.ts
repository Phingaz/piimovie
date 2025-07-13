'use client';
import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface HQResponse {
  query: string;
  hasHQ: boolean;
  duration: number;
}

interface HQStatusCache {
  [key: string]: {
    hasHQ: boolean;
    timestamp: number;
  };
}

const HQ_API_URL = '/api/hq-check';
const hqCache: HQStatusCache = {};
const CACHE_DURATION = 1000 * 60 * 60 * 24;

export const useHQStatus = (movieTitle?: string) => {
  const [hqStatus, setHqStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHQAvailability = useCallback(async (title: string): Promise<boolean | null> => {
    if (!title?.trim()) return null;

    const cacheKey = title.toLowerCase().trim();
    const cached = hqCache[cacheKey];

    // Check cache first
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.hasHQ;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(HQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Api-Key': process.env.NEXT_PUBLIC_INTERNAL_API_KEY || '',
        },
        body: JSON.stringify({ query: title }),
      });

      if (!response.ok) {
        throw new Error(`HQ API error: ${response.status}`);
      }

      const data: HQResponse = await response.json();

      // Cache the result
      hqCache[cacheKey] = {
        hasHQ: data.hasHQ,
        timestamp: Date.now(),
      };

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

    // Process in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < titles.length; i += batchSize) {
      const batch = titles.slice(i, i + batchSize);

      const promises = batch.map(async (title) => {
        const cacheKey = title.toLowerCase().trim();
        const cached = hqCache[cacheKey];

        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          return { title, hasHQ: cached.hasHQ };
        }

        try {
          const response = await fetch(HQ_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: title }),
          });

          if (response.ok) {
            const data: HQResponse = await response.json();
            hqCache[cacheKey] = {
              hasHQ: data.hasHQ,
              timestamp: Date.now(),
            };
            return { title, hasHQ: data.hasHQ };
          }
        } catch (err) {
          logger.error('Batch HQ check failed for title:', { title, error: err });
        }

        return { title, hasHQ: false };
      });

      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ title, hasHQ }) => {
        results[title] = hasHQ;
      });

      if (i + batchSize < titles.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
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
