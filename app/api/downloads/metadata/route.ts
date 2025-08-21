import ENV from '@/lib/env';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.magnet_link) {
    return new Response(JSON.stringify({ error: 'magnet_link required' }), { status: 400 });
  }
  const upstream = new URL('/api/v1/torrent/files', ENV.SERVER_API_URL);
  const res = await fetch(upstream, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': ENV.SERVER_API_KEY },
    body: JSON.stringify({
      magnet_link: body.magnet_link,
      timeout: body.timeout ?? 60,
      auto_preload: body.auto_preload ?? true,
    }),
  });
  if (!res.ok) return new Response(await res.text(), { status: res.status });
  const data = await res.json();
  return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
}
