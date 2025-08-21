import ENV from '@/lib/env';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const magnet = searchParams.get('magnet_link');
  const fileIndex = searchParams.get('file_index');
  const chunkIndex = searchParams.get('chunk_index');
  const chunkSize = searchParams.get('chunk_size');
  if (!magnet || !fileIndex || !chunkIndex) {
    return new Response(JSON.stringify({ error: 'magnet_link, file_index, chunk_index required' }), { status: 400 });
  }
  const upstream = new URL('/api/v1/torrent/download-chunk', ENV.SERVER_API_URL);
  upstream.searchParams.set('magnet_link', magnet);
  upstream.searchParams.set('file_index', fileIndex);
  upstream.searchParams.set('chunk_index', chunkIndex);
  if (chunkSize) upstream.searchParams.set('chunk_size', chunkSize);
  const res = await fetch(upstream, { headers: { 'X-API-Key': ENV.SERVER_API_KEY } });
  if (!res.ok) {
    return new Response(await res.text(), { status: res.status });
  }
  const arrayBuf = await res.arrayBuffer();
  return new Response(arrayBuf, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'no-store',
    },
  });
}
