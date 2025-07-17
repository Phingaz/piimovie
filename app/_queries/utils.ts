import ENV from '@/lib/env';
import { FetchDataArgs } from '../_types/utils';
import { apiCache, generateCacheKey } from '@/lib/cache';

const token = ENV.TMDB_API_KEY;

export const logger = (message?: string) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] - ${message || 'Error message is empty'}`);
};
export const serverResult = <T>(data: T, message = 'Successfully fetched data') => {
  logger(message);
  return { data, success: true, message };
};

export function catchError(error: unknown) {
  let status_message = 'An unknown error occurred';
  const timestamp = new Date().toISOString();

  if (error instanceof Error) {
    status_message = error.message;
    console.error(`[${timestamp}] - ${error}`);
  } else {
    console.error(error);
  }
  return { success: false, message: status_message, data: null };
}

export async function fetchData<T>({ url, args, message }: FetchDataArgs<T>) {
  try {
    if (!url) throw new Error('No url provided');

    const cacheKey = generateCacheKey(url, args);

    // Check cache first
    const cached = await apiCache.get(cacheKey);
    if (cached) {
      return serverResult(cached as T, `[CACHED] ${message}`);
    }

    // Prepare fetch options with proper defaults
    const fetchOptions: RequestInit = {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...args?.headers },
      ...args,
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as T;
    apiCache.set(cacheKey, data).catch((error) => console.warn('Failed to cache data:', error));

    return serverResult(data, message);
  } catch (error) {
    return catchError(error);
  }
}
