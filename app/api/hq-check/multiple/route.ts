import envProxy from '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';
import { hQCache, generateCacheKey } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    const { queries } = await request.json();

    if (!queries || !Array.isArray(queries) || queries.length === 0) {
      return NextResponse.json(
        { error: 'Queries parameter is required and must be a non-empty array' },
        { status: 400 },
      );
    }

    const results = [];
    const uncachedQueries = [];

    // Check cache for each query first
    for (const query of queries) {
      const cacheKey = generateCacheKey('hq-check', { query: query.toLowerCase().trim() });
      const cachedResult = await hQCache.get(cacheKey);

      if (cachedResult !== null) {
        results.push(cachedResult);
      } else {
        uncachedQueries.push(query);
      }
    }

    // If we have uncached queries, fetch them from the API
    if (uncachedQueries.length > 0) {
      const HQ_API_URL = envProxy.HQ_API_URL;
      const apiKey = envProxy.HQ_API_KEY;

      const multipleEndpoint = `${HQ_API_URL.replace('/api/v1/query', '/api/v1/query/multiple')}`;

      const response = await fetch(multipleEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ queries: uncachedQueries }),
      });

      if (!response.ok) {
        throw new Error(`HQ API error: ${response.status}`);
      }

      const data = await response.json();

      // Cache each result and add to results
      if (data.results && Array.isArray(data.results)) {
        for (const result of data.results) {
          const cacheKey = generateCacheKey('hq-check', { query: result.query.toLowerCase().trim() });
          await hQCache.set(cacheKey, result);
          results.push(result);
        }
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Multiple HQ API proxy error:', error);
    return NextResponse.json({ error: 'Failed to check multiple HQ availability' }, { status: 500 });
  }
}
