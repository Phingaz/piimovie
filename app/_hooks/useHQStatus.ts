'use client';
import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface HQResponse {
  query: string;
  hasHQ: boolean;
  duration: number;
}

const HQ_API_URL = '/api/hq-check';

export const useHQStatus = (movieTitle?: string) => {
  const [hqStatus, setHqStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHQAvailability = useCallback(async (title: string): Promise<boolean | null> => {
    if (!title?.trim()) return null;

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

    try {
      const response = await fetch('/api/hq-check/multiple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ queries: titles }),
      });

      if (response.ok) {
        const data: { results: Array<{ query: string; hasHQ: boolean; duration: number }> } = await response.json();

        // Update state with results
        const results: Record<string, boolean> = {};
        for (const { query, hasHQ } of data.results) {
          results[query] = hasHQ;
        }

        setHqStatuses((prev) => ({ ...prev, ...results }));
      } else {
        logger.error('Multiple HQ check API error:', { status: response.status, statusText: response.statusText });
        // Set default false for failed queries
        const results: Record<string, boolean> = {};
        titles.forEach((title) => {
          results[title] = false;
        });
        setHqStatuses((prev) => ({ ...prev, ...results }));
      }
    } catch (err) {
      logger.error('Multiple HQ check failed:', { error: err, titles });
      // Set default false for failed queries
      const results: Record<string, boolean> = {};
      titles.forEach((title) => {
        results[title] = false;
      });
      setHqStatuses((prev) => ({ ...prev, ...results }));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    hqStatuses,
    loading,
    checkMultipleHQ,
  };
};
