// Download service skeleton (Phase 1)
import ENV from './env';
import { db } from './download-db';
import {
  DownloadLifecycleState,
  DownloadRecord,
  StartDownloadParams,
  StartResult,
  DownloadId
} from '../app/_types/downloads';
import { decryptChunk } from './crypto/downloadCrypto';

// Lightweight SHA-1 helper for ID generation (not for security)
async function sha1Id(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function buildId(magnetLink: string, fileIndex: number) {
  return sha1Id(`${magnetLink}|${fileIndex}`);
}

export class DownloadService {
  private active = new Set<DownloadId>();

  async start(params: StartDownloadParams): Promise<StartResult> {
    const { magnetLink, fileIndex } = params;
    const id = await buildId(magnetLink, fileIndex);
    const existing = await db.downloads.get(id);
    if (existing) return { id, alreadyExisted: true };

    // Placeholder: fetch /download-info
    // TODO Phase 2: Replace with real network call
    const chunk_size = params.chunkSize || ENV.DEFAULT_CHUNK_SIZE;
    const fakeInfo = {
      total_chunks: 0,
      chunk_size,
      file_size: 0,
      last_chunk_size: 0,
      file_name: 'unknown',
      mime_type: 'application/octet-stream'
    };

    const now = Date.now();
    const record: DownloadRecord = {
      id,
      magnetLink,
      fileIndex,
      lifecycle: DownloadLifecycleState.QUEUED,
      downloadedBytes: 0,
      progressPercentage: 0,
      downloadRate: 0,
      uploadRate: 0,
      numSeeds: 0,
      numPeers: 0,
      lastUpdated: now,
      createdAt: now,
      updatedAt: now,
      encrypted: ENV.DOWNLOAD_ENCRYPTION_ENABLED,
      ...fakeInfo
    };
    await db.downloads.put(record);
    return { id };
  }

  async pause(id: DownloadId) {
  await db.downloads.where('id').equals(id).modify((r: DownloadRecord) => { r.lifecycle = DownloadLifecycleState.PAUSED; r.updatedAt = Date.now(); });
    this.active.delete(id);
  }

  async resume(id: DownloadId) {
    const rec = await db.downloads.get(id);
    if (!rec) return;
    if (rec.lifecycle === DownloadLifecycleState.COMPLETED) return;
    await db.downloads.update(id, { lifecycle: DownloadLifecycleState.QUEUED, updatedAt: Date.now() });
  }

  async cancel(id: DownloadId) {
    // remove record + chunks
  await db.chunks.where('downloadId').equals(id).delete();
  await db.downloads.delete(id);
    this.active.delete(id);
  }

  async getRecord(id: DownloadId) {
    return db.downloads.get(id);
  }

  async list() {
    return db.downloads.toArray();
  }

  async getBlob(id: DownloadId): Promise<Blob> {
    const rec = await db.downloads.get(id);
    if (!rec) throw new Error('Not found');
    const chunks = await db.chunks.where('downloadId').equals(id).sortBy('chunkIndex');
    const parts: BlobPart[] = [];
    for (const c of chunks) {
      let data: Blob | ArrayBuffer = c.data;
      if (rec.encrypted && c.iv) {
        const ab = c.data instanceof Blob ? await c.data.arrayBuffer() : c.data;
        const plain = await decryptChunk(rec.magnetLink, rec.fileIndex, ab, c.iv as Uint8Array);
        data = new Blob([plain]);
      }
      parts.push(data instanceof Blob ? data : new Blob([data]));
    }
    return new Blob(parts, { type: rec.mime_type });
  }
}

export const downloadService = new DownloadService();
