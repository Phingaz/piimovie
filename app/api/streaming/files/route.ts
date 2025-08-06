import ENV from '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = ENV.STREAMING_API_BASE;
const API_KEY = ENV.SERVER_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE}/streaming/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Streaming API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Streaming files API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch streaming files',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
