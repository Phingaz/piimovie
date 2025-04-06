import ENV from '@/lib/env';
import { FetchDataArgs } from '../types/utils';

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

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000;

export async function fetchData<T>({ url, args, message }: FetchDataArgs<T>) {
  try {
    if (!url) throw Error('No url provided');

    const cacheKey = generateCacheKey(url, args);
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return serverResult(cached.data as T, `[CACHED] ${message}`);
    }

    const req = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      ...args,
    });

    if (req.status !== 200) {
      throw Error(req.statusText);
    }

    const res = await req.json();
    cache.set(cacheKey, { data: res, timestamp: Date.now() });

    return serverResult(res as T, message);
  } catch (error) {
    return catchError(error);
  }
}

function generateCacheKey(url: string, args: unknown): string {
  return `${url}:${JSON.stringify(args)}`;
}
