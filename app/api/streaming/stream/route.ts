import ENV from '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = ENV.STREAMING_API_BASE;
const API_KEY = ENV.SERVER_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const magnetLink = searchParams.get('magnet_link');
    const fileIndex = searchParams.get('file_index');

    if (!magnetLink || !fileIndex) {
      return NextResponse.json({ error: 'Missing required parameters: magnet_link and file_index' }, { status: 400 });
    }

    // Create the streaming URL
    const streamingUrl = `${API_BASE}/streaming/stream?magnet_link=${encodeURIComponent(magnetLink)}&file_index=${fileIndex}`;

    // Forward the request to the streaming API with proper headers
    const response = await fetch(streamingUrl, {
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
        Range: request.headers.get('range') || '',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'video/webm,video/ogg,video/*;q=0.9,application/octet-stream;q=0.7,audio/*;q=0.6,*/*;q=0.5',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'identity',
        DNT: '1',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      console.error('Streaming API error:', response.status, response.statusText);
      throw new Error(`Streaming API error: ${response.statusText}`);
    }

    // Create a new response with the video stream
    const headers = new Headers();

    // Copy relevant headers from the streaming API response
    if (response.headers.get('content-type')) {
      headers.set('content-type', response.headers.get('content-type')!);
    }
    if (response.headers.get('content-length')) {
      headers.set('content-length', response.headers.get('content-length')!);
    }
    if (response.headers.get('content-range')) {
      headers.set('content-range', response.headers.get('content-range')!);
    }
    if (response.headers.get('accept-ranges')) {
      headers.set('accept-ranges', response.headers.get('accept-ranges')!);
    }

    // Enable CORS for video streaming
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
    headers.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');

    // Optimize for streaming
    headers.set('Cache-Control', 'public, max-age=3600, immutable');
    headers.set('Connection', 'keep-alive');

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Streaming API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to stream video',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type',
    },
  });
}
