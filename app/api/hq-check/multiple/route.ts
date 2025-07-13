import envProxy from '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { queries } = await request.json();

    if (!queries || !Array.isArray(queries) || queries.length === 0) {
      return NextResponse.json({ error: 'Queries parameter is required and must be a non-empty array' }, { status: 400 });
    }

    const HQ_API_URL = envProxy.HQ_API_URL;
    const apiKey = envProxy.HQ_API_KEY;

    const multipleEndpoint = `${HQ_API_URL.replace('/api/v1/query', '/api/v1/query/multiple')}`;

    const response = await fetch(multipleEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({ queries }),
    });

    if (!response.ok) {
      throw new Error(`HQ API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Multiple HQ API proxy error:', error);
    return NextResponse.json({ error: 'Failed to check multiple HQ availability' }, { status: 500 });
  }
}
