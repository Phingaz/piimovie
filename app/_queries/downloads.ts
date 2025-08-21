import { DownloadInfo, DownloadProgress } from '../_types/downloads';
import { TorrentMetadataResponse } from '../_types/downloads';

const base = '/api/downloads';

async function json<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed ${res.status}`);
  return res.json();
}

export async function fetchDownloadInfo(
  magnetLink: string,
  fileIndex: number,
  chunkSize?: number,
): Promise<DownloadInfo> {
  const u = new URL(`${base}/info`, window.location.origin);
  u.searchParams.set('magnet_link', magnetLink);
  u.searchParams.set('file_index', String(fileIndex));
  if (chunkSize) u.searchParams.set('chunk_size', String(chunkSize));
  return json<DownloadInfo>(u.toString());
}

export async function fetchDownloadProgress(magnetLink: string, fileIndex: number): Promise<DownloadProgress> {
  const u = new URL(`${base}/progress`, window.location.origin);
  u.searchParams.set('magnet_link', magnetLink);
  u.searchParams.set('file_index', String(fileIndex));
  return json<DownloadProgress>(u.toString());
}

export async function fetchChunk(
  magnetLink: string,
  fileIndex: number,
  chunkIndex: number,
  chunkSize?: number,
): Promise<ArrayBuffer> {
  const u = new URL(`${base}/chunk`, window.location.origin);
  u.searchParams.set('magnet_link', magnetLink);
  u.searchParams.set('file_index', String(fileIndex));
  u.searchParams.set('chunk_index', String(chunkIndex));
  if (chunkSize) u.searchParams.set('chunk_size', String(chunkSize));
  const res = await fetch(u.toString());
  if (!res.ok) throw new Error(`Chunk ${chunkIndex} failed ${res.status}`);
  return res.arrayBuffer();
}

export async function fetchTorrentMetadata(magnetLink: string): Promise<TorrentMetadataResponse> {
  const res = await fetch('/api/downloads/metadata', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ magnet_link: magnetLink }),
  });
  if (!res.ok) throw new Error(`Metadata failed ${res.status}`);
  return res.json();
}
