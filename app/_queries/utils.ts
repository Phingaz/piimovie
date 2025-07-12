import ENV from '@/lib/env';
import { apiCache, generateCacheKey } from '@/lib/cache';
import { FetchDataArgs } from '../_types/utils';
import { logger, AppError, createSafeErrorMessage } from '@/lib/logger';

const token = ENV.TMDB_API_KEY;

export const serverResult = <T>(data: T, message = 'Successfully fetched data') => {
  logger.info(message);
  return { data, success: true, message };
};

export function catchError(error: unknown) {
  const safeMessage = createSafeErrorMessage(error);

  if (error instanceof AppError) {
    logger.warn('Application error', error.context, error);
  } else {
    logger.error('Unexpected error', {}, error);
  }

  return { success: false, message: safeMessage, data: null };
}

export async function fetchData<T>({ url, args, message }: FetchDataArgs<T>) {
  try {
    if (!url) throw new AppError('No URL provided', 400);

    const cacheKey = generateCacheKey(url, args);
    const cached = apiCache.get(cacheKey);

    if (cached) {
      logger.debug(`[CACHED] ${message}`, { cacheKey });
      return serverResult(cached as T, `[CACHED] ${message}`);
    }

    const req = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      ...args,
    });

    if (req.status !== 200) {
      throw new AppError(`TMDB API request failed: ${req.statusText}`, req.status, true, { url, status: req.status });
    }

    const res = await req.json();
    apiCache.set(cacheKey, res);

    const logMessage = message || 'Data fetched successfully';
    logger.info(logMessage, { url: url ?? 'undefined', cacheKey });
    return serverResult(res as T, logMessage);
  } catch (error) {
    return catchError(error);
  }
}
