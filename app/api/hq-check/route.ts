import ENV from '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';
import { hQCache, generateCacheKey } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // Generate cache key for HQ status
    const cacheKey = generateCacheKey('hq-check', { query: query.toLowerCase().trim() });

    // Check cache first
    const cachedResult = await hQCache.get(cacheKey);
    if (cachedResult !== null) {
      return NextResponse.json(cachedResult);
    }

    const HQ_API_URL = ENV.HQ_API_URL;
    const apiKey = ENV.SERVER_API_KEY;

    const response = await fetch(HQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HQ API error: ${response.status}`);
    }

    const data = await response.json();
    await hQCache.set(cacheKey, data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('HQ API proxy error:', error);
    return NextResponse.json({ error: 'Failed to check HQ availability' }, { status: 500 });
  }
}
