import envProxy from '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const HQ_API_URL = envProxy.HQ_API_URL;
    const apiKey = envProxy.HQ_API_KEY;

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

    return NextResponse.json(data);
  } catch (error) {
    console.error('HQ API proxy error:', error);
    return NextResponse.json({ error: 'Failed to check HQ availability' }, { status: 500 });
  }
}
